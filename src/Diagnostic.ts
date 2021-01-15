import * as fs from 'fs';
import * as vscode from 'vscode';
import { constants } from 'fs';
import { Project } from './projects/Project';
import { ProjectCollector } from './projects/ProjectCollector';
import { ProjectTypes } from './projects/ProjectTypes';

export class Diagnostic
{
    /**
     * List that contains all diagnostics of all documents
     */
    private collection: vscode.DiagnosticCollection;

    /**
     * List that contains all diagnostics of the current open document
     */
    private diagnostics: Array<vscode.Diagnostic>;

    public constructor(collection: vscode.DiagnosticCollection)
    {
        this.collection = collection;
        this.diagnostics = new Array<vscode.Diagnostic>();
    }

    public UpdateDiagnostics(document: vscode.TextDocument): void
    {
        if (!document)
        {
            this.collection.clear();
        }

        this.diagnostics.length = 0;

        const projectList = new ProjectCollector(document, false).ProjectList;

        const alreadyUsedGuid = new Array<[number, string]>();

        let insideNestedProjects = false;

        for(let lineNumber = 0; lineNumber < document.lineCount; lineNumber++)
        {
            const textLine = document.lineAt(lineNumber);
            const lowerCase = textLine.text.toLowerCase();

            this.CheckForMissingProjectGuid(textLine, projectList);
            this.CheckForWrongPascalCase(textLine);

            if(lowerCase.indexOf("globalsection(nestedprojects)") > -1)
            {
                insideNestedProjects = true;
                continue;
            }

            if(lowerCase.indexOf("endglobalsection") > -1)
            {
                insideNestedProjects = false;
                continue;
            }

            if(insideNestedProjects)
            {
                this.CheckForDoubleUsingInNestedProjects(textLine, alreadyUsedGuid);
            }
        }

        for(const project of projectList)
        {
            this.CheckForDoubleUsedProjectGuids(project, projectList);
            this.CheckForDoubleUsedProjectNames(project, projectList);
            this.CheckForDifferentProjectTypeAndFileExtension(project);

            if(project.IsSolutionFolder())
            {
                continue;
            }

            this.CheckForDifferentProjectNameAndProjectFile(project);
            this.CheckForDifferentProjectNameAndProjectPath(project);
            this.CheckForNotFoundProjectFiles(project);
            this.CheckForUnknownProjectTypes(project);
        }

        this.collection.set(document.uri, this.diagnostics);
        
    }

    private CheckForMissingProjectGuid(textLine: vscode.TextLine, projectList: Array<Project>): void
    {
        const lowerCase = textLine.text.toLowerCase();

        // ignore lines with projects and line solution guid
        if(lowerCase.startsWith("project(") || lowerCase.indexOf("solutionguid") > -1)
        {
            return;
        }

        // ignore lines than don't contain a guid
        if(textLine.text.indexOf("{") < 0 || textLine.text.indexOf("}") < 0)
        {
            return;
        }

        let textPosition = 0;

        do
        {
            const guidStart = textLine.text.indexOf("{", textPosition) + 1;
            const guidEnd = textLine.text.indexOf("}", textPosition);

            if(guidStart === -1 || guidEnd === -1)
            {
                break;
            }

            const guidToCheck = textLine.text.substr(guidStart, guidEnd - guidStart);

            if(projectList.findIndex(found => found.Guid === guidToCheck) < 0)
            {
                const startPosition = new vscode.Position(textLine.lineNumber, guidStart);
                const endPosition = new vscode.Position(textLine.lineNumber, guidEnd)

                const diagnostic = new vscode.Diagnostic(
                    new vscode.Range(startPosition, endPosition),
                    `Project with Guid {${guidToCheck}} not found in solution`,
                    vscode.DiagnosticSeverity.Error)

                this.diagnostics.push(diagnostic);
            }

            textPosition = guidEnd + 1;
        }
        while(textPosition < textLine.text.length)
    }

    private CheckForDoubleUsingInNestedProjects(textLine: vscode.TextLine, alreadyUsedGuid: Array<[number, string]>): void
    {
        const guidStart = textLine.text.indexOf("{",) + 1;
        const guidEnd = textLine.text.indexOf("}");

        if(guidStart === -1 || guidEnd === -1)
        {
            return;
        }

        const guidToCheck = textLine.text.substr(guidStart, guidEnd - guidStart);

        const found = alreadyUsedGuid.find(([, guidNumber]) => guidNumber === guidToCheck);

        alreadyUsedGuid.push([textLine.lineNumber, guidToCheck]);
        if(!found)
        {
            return;
        }

        const [lineNumber, ] = found;

        const startPosition = new vscode.Position(textLine.lineNumber, guidStart);
        const endPosition = new vscode.Position(textLine.lineNumber, guidEnd)

        const diagnostic = new vscode.Diagnostic(
            new vscode.Range(startPosition, endPosition),
            `Guid {${guidToCheck}} is already used in Line ${lineNumber}`,
            vscode.DiagnosticSeverity.Warning)
            
            this.diagnostics.push(diagnostic);
    }

    private CheckForNotFoundProjectFiles(project: Project): void
    {
        try
        {
            fs.accessSync(project.AbsolutePath, constants.R_OK)
        }
        catch
        {
            const diagnostic = new vscode.Diagnostic(
                project.GetPathRange(),
                `File "${project.RelativePath}" not found`,
                vscode.DiagnosticSeverity.Error);
                
            this.diagnostics.push(diagnostic);
        }
    }

    private CheckForDifferentProjectNameAndProjectFile(project: Project): void
    {
        const filleName = project.GetProjectFileNameWithoutExtension();

        if(project.Name === filleName)
        {
            return;
        }

        const diagnostic = new vscode.Diagnostic(
            project.GetFileNameWithoutExtensionRange(),
            `Filename "${filleName}" differ from project name "${project.Name}"`,
            vscode.DiagnosticSeverity.Warning);
            
        this.diagnostics.push(diagnostic);
    }

    private CheckForDifferentProjectTypeAndFileExtension(project: Project): void
    {
        const fileExtension = project.GetProjectFileNameExtension();

        if(ProjectTypes.FileExtensionMatchProjectType(fileExtension, project.ProjectType))
        {
            return;
        }

        const diagnostic = new vscode.Diagnostic(
            project.GetFileExtensionRange(),
            `File extension "${fileExtension}" differ from project type "${ProjectTypes.GetProjectTypeName(project.ProjectType)}"`,
            vscode.DiagnosticSeverity.Warning);
            
        this.diagnostics.push(diagnostic);
    }

    private CheckForDifferentProjectNameAndProjectPath(project: Project): void
    {
        const projectFolder = project.GetProjectFolder();

        if(projectFolder === project.Name)
        {
            return;
        }

        const diagnostic = new vscode.Diagnostic(
            project.GetProjectFolderRange(),
            `The project folder "${projectFolder}" differ from project name "${project.Name}"`,
            vscode.DiagnosticSeverity.Warning);
            
        this.diagnostics.push(diagnostic);
    }

    private CheckForDoubleUsedProjectGuids(project: Project, projectList: Array<Project>): void
    {
        const doubleProjectEntries = projectList.filter(found => found.Guid === project.Guid);
        if(doubleProjectEntries.length < 2)
        {
            return;
        }

        for (const doubleProjectEntry of doubleProjectEntries)
        {
            if(doubleProjectEntry.Line.lineNumber == project.Line.lineNumber)
            {
                // avoid double diagnostic entires
                continue;
            }

            const diagnostic = new vscode.Diagnostic(
                doubleProjectEntry.GetProjectGuidRange(),
                `The project guid {${project.Guid}} is already used in line ${project.Line.lineNumber + 1} by project with name "${project.Name}".`,
                vscode.DiagnosticSeverity.Error);

            this.diagnostics.push(diagnostic);
        }
    }

    private CheckForDoubleUsedProjectNames(project: Project, projectList: Array<Project>): void
    {
        const doubleProjectEntries = projectList.filter(found => found.Name === project.Name);
        if(doubleProjectEntries.length < 2)
        {
            return;
        }

        for (const doubleProjectEntry of doubleProjectEntries)
        {
            if(doubleProjectEntry.Line.lineNumber == project.Line.lineNumber)
            {
                // avoid double diagnostic entires
                continue;
            }

            let diagnostic: vscode.Diagnostic;

            if(doubleProjectEntry.IsSolutionFolder())
            {
                diagnostic = new vscode.Diagnostic(
                    doubleProjectEntry.GetProjectNameRange(),
                    `The solution folder "${doubleProjectEntry.Name}" has the same name as the project in line ${project.Line.lineNumber + 1} with Guid {${project.Guid}}.`,
                    vscode.DiagnosticSeverity.Information);
            }
            else
            {
                diagnostic = new vscode.Diagnostic(
                    doubleProjectEntry.GetProjectNameRange(),
                    `The project name "${doubleProjectEntry.Name}" is already used by project in line ${project.Line.lineNumber + 1} with Guid {${project.Guid}}.`,
                    vscode.DiagnosticSeverity.Warning);
            }

            this.diagnostics.push(diagnostic);
        }
    }

    private CheckForUnknownProjectTypes(project: Project): void
    {
        if(ProjectTypes.IsKnownProjectType(project.ProjectType))
        {
            return;
        }

        const diagnostic = new vscode.Diagnostic(
            project.GetProjectTypeRange(),
            `The project type {"${project.ProjectType}"} is unknown.`,
            vscode.DiagnosticSeverity.Error);

        this.diagnostics.push(diagnostic);
    }

    private CheckForWrongPascalCase(textLine: vscode.TextLine): void
    {
        const textToCheck = textLine.text.trimLeft();

        // ignore all lines that start with a brace
        if(textToCheck.indexOf("{") == 0)
        {
            return;
        }

        const lowerCaseText = textToCheck.toLowerCase();

        if(this.CheckWord(textLine, textToCheck, lowerCaseText, "EndGlobalSection"))
        {
            return;
        }

        if(this.CheckWord(textLine, textToCheck, lowerCaseText, "EndGlobal"))
        {
            return;
        }

        if(this.CheckWord(textLine, textToCheck, lowerCaseText, "EndProjectSection"))
        {
            return;
        }

        if(this.CheckWord(textLine, textToCheck, lowerCaseText, "EndProject"))
        {
            return;
        }

        if(this.CheckWord(textLine, textToCheck, lowerCaseText, "GlobalSection"))
        {
            return;
        }

        if(this.CheckWord(textLine, textToCheck, lowerCaseText, "Global"))
        {
            return;
        }

        if(this.CheckWord(textLine, textToCheck, lowerCaseText, "ProjectSection"))
        {
            return;
        }

        if(this.CheckWord(textLine, textToCheck, lowerCaseText, "Project"))
        {
            return;
        }
    }

    private CheckWord(textLine: vscode.TextLine, textToCheck: string, lowerCaseText: string, wordToCheck: string): boolean
    {
        if(!lowerCaseText.startsWith(wordToCheck.toLowerCase()))
        {
            return false;
        }

        if(textToCheck.startsWith(wordToCheck))
        {
            return true;
        }

        const characterStart = textLine.text.indexOf(textToCheck);
        const notCorrectWord = textLine.text.substr(characterStart, wordToCheck.length)

        const diagnostic = new vscode.Diagnostic(
            this.GetRange(textLine, characterStart, wordToCheck),
            `The world "${notCorrectWord}" should be correct write in PascalCase as "${wordToCheck}".`,
            vscode.DiagnosticSeverity.Warning);

        this.diagnostics.push(diagnostic);
        return true;
    }

    private GetRange(textLine: vscode.TextLine, characterStart: number, word: string): vscode.Range
    {
        var characterEnd = characterStart + word.length;

        var start = new vscode.Position(textLine.lineNumber, characterStart);
        var end = new vscode.Position(textLine.lineNumber, characterEnd);

        return new vscode.Range(start, end);
    }
}