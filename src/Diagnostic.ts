import * as fs from 'fs';
import * as path from 'path';
import * as vscode from 'vscode';
import { constants } from 'fs';
import { ProjectTypes } from './Projects/ProjectTypes';
import { VscodeHelper } from './Helper/vscodeHelper';
import { SolutionHelper } from './Helper/SolutionHelper';
import { Keyword } from './Constants/Keyword';
import { Solution } from './Classes/Solution';
import { Project } from './Classes/Project';
import { Properties } from './Constants/Properties';

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

    /**
     * Indicate that we are currently inside "SharedMSBuildProjectFiles"
     */
    private isInSharedMSBuildProjectFiles: boolean;

    public constructor(collection: vscode.DiagnosticCollection)
    {
        this.collection = collection;
        this.diagnostics = new Array<vscode.Diagnostic>();
        this.isInSharedMSBuildProjectFiles = false;
    }

    /**
     * Remove the diagnostic for the given document
     * @param textDocument The document that don't longer need a diagnostic
     */
    public ClearDiagnostic(textDocument: vscode.TextDocument|undefined): void
    {
        if(textDocument)
        {
            this.collection.delete(textDocument.uri);
        }
        else
        {
            this.collection.clear();
        }
    }

    /**
     * Update the diagnostic for the given document
     * @param textDocument The text document that contains the complete file content
     */
    public UpdateDiagnostics(textDocument: vscode.TextDocument): void
    {
        this.diagnostics.length = 0;

        const solution = new Solution(textDocument, true);

        for(let lineNumber = 0; lineNumber < textDocument.lineCount; lineNumber++)
        {
            const textLine = textDocument.lineAt(lineNumber);

            this.CheckForMissingProjectGuid(textLine, solution.Projects);
            this.CheckForWrongPascalCase(textLine);

            this.CheckForEmptyLines(textLine, textDocument);
        }

        for(const project of solution.Projects)
        {
            this.CheckForMissingEndTag(project);
            this.CheckForDoubleUsingInNestedProjects(project, solution.Projects);
            this.CheckForDoubleUsedProjectGuids(project, solution.Projects);
            this.CheckForDoubleUsedProjectNames(project, solution.Projects);
            this.CheckForDifferentProjectTypeAndFileExtension(project);
            this.CheckForNotFoundProjectSolutionFiles(project, textDocument);
            this.CheckForMissingProjectParameter(project);

            if(project.IsSolutionFolder())
            {
                continue;
            }
            
            this.CheckForDifferentProjectNameAndProjectFile(project);
            this.CheckForDifferentProjectNameAndProjectPath(project);
            this.CheckForNotFoundProjectFiles(project);
            this.CheckForUnknownProjectTypes(project);
        }

        this.CheckForMissingConfiguration(solution);
        this.CheckForUniqueSolutionGuid(solution);
        this.CheckForMissingVersionLines(solution);

        this.collection.set(textDocument.uri, this.diagnostics);
    }

    private CheckForMissingProjectGuid(textLine: vscode.TextLine, projectList: Array<Project>): void
    {
        const lowerCase = textLine.text.trim().toLowerCase();

        if(lowerCase.startsWith("globalsection(sharedmsbuildprojectfiles)"))
        {
            this.isInSharedMSBuildProjectFiles = true;
        }

        if(lowerCase.startsWith("endglobalsection"))
        {
            this.isInSharedMSBuildProjectFiles = false;
        }

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
                let diagnostic: vscode.Diagnostic;

                const uppercaseGuid = guidToCheck.toUpperCase();
                if(projectList.findIndex(found => found.Guid === uppercaseGuid) < 0)
                {
                    diagnostic = new vscode.Diagnostic(
                        this.GetRange(textLine, guidStart, guidToCheck),
                        `Project with Guid {${guidToCheck}} not found in solution.`,
                        vscode.DiagnosticSeverity.Error)

                    this.diagnostics.push(diagnostic);
                }
                else if(!this.isInSharedMSBuildProjectFiles)
                {
                    diagnostic = new vscode.Diagnostic(
                        this.GetRange(textLine, guidStart, guidToCheck),
                        `Guid {${guidToCheck}} should we written in uppercase.`,
                        vscode.DiagnosticSeverity.Information)

                    this.diagnostics.push(diagnostic);
                }
            }

            textPosition = guidEnd + 1;
        }
        while(textPosition < textLine.text.length)
    }

    private CheckForMissingConfiguration(solution: Solution): void
    {
        var solutionConfiguration = SolutionHelper.GetGlobalSection(solution, Keyword.SolutionConfigurationPlatforms);
        var projectConfiguration = SolutionHelper.GetGlobalSection(solution, Keyword.ProjectConfigurationPlatforms);

        if(solutionConfiguration === undefined || projectConfiguration === undefined)
        {
            return;
        }

        for(const [textLine, leftSide, rightSide] of projectConfiguration.KeyValueList)
        {
            // TODO: find a better way for this
            const leftSplit = leftSide.replace(".0", "").split('.');
            if(leftSplit.length < 2)
            {
                continue;
            }

            // TODO: find a better way for this
            const leftConfiguration = leftSplit.slice(1, leftSplit.length - 1).join(".");
            const rightConfiguration = rightSide;

            let foundLeft = false;
            let foundRight = false;

            for(const [, , configuration] of solutionConfiguration.KeyValueList)
            {
                if(configuration === leftConfiguration)
                {
                    foundLeft = true;
                }

                if(configuration === rightConfiguration)
                {
                    foundRight = true;
                }
            }

            if(!foundLeft)
            {
                const diagnostic = new vscode.Diagnostic(
                    VscodeHelper.GetRange(textLine, leftConfiguration, leftConfiguration),
                    `Configuration "${leftConfiguration}" not defined under "SolutionConfigurationPlatforms"`,
                    vscode.DiagnosticSeverity.Error);

                    this.diagnostics.push(diagnostic);
            }

            if(!foundRight)
            {
                const diagnostic = new vscode.Diagnostic(
                    VscodeHelper.GetLastRange(textLine, rightConfiguration, rightConfiguration),
                    `Configuration "${rightConfiguration}" not defined under "SolutionConfigurationPlatforms"`,
                    vscode.DiagnosticSeverity.Error);

                    this.diagnostics.push(diagnostic);
            }
        }
    }

    private CheckForDoubleUsingInNestedProjects(project: Project, projectList: Array<Project>): void
    {
        if(project.NestedInProjects.length < 1)
        {
            return;
        }

        for(const [line1, nestedProjectGuid] of project.NestedInProjects)
        {
            for(const [line2, ] of project.NestedInProjects)
            {
                if(line1.lineNumber === line2.lineNumber)
                {
                    continue;
                }

                const nestedProject = projectList.find(found => found.Guid === nestedProjectGuid);

                const guidStart = line2.text.indexOf("{") + 1;
                const guidEnd = line2.text.indexOf("}", guidStart);

                const diagnostic = new vscode.Diagnostic(
                    this.GetRangeStartEnd(line2, guidStart, guidEnd),
                    `Project "${project.Name}" is already nested to Project "${nestedProject?.Name}" in line ${line1.lineNumber + 1}`,
                    vscode.DiagnosticSeverity.Warning)
                    
                    this.diagnostics.push(diagnostic);
            }
        }
    }

    private CheckForNotFoundProjectFiles(project: Project): void
    {
        try
        {
            fs.accessSync(project.AbsolutePath, constants.R_OK);
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

        if(!ProjectTypes.FileExtensionMatchProjectType(fileExtension, project.ProjectType))
        {
            const diagnostic = new vscode.Diagnostic(
                project.GetFileExtensionRange(),
                `File extension "${fileExtension}" differ from project type "${ProjectTypes.GetProjectTypeName(project.ProjectType)}"`,
                vscode.DiagnosticSeverity.Warning);

            this.diagnostics.push(diagnostic);
        }

        if(!ProjectTypes.ProjectTypeMatchFileExtension(fileExtension, project.ProjectType))
        {
            const diagnostic = new vscode.Diagnostic(
                project.GetFileExtensionRange(),
                `Project type "${ProjectTypes.GetProjectTypeName(project.ProjectType)}" differ from File extension "${fileExtension}"`,
                vscode.DiagnosticSeverity.Warning);

            this.diagnostics.push(diagnostic);
        }
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
        if(project.ProjectType === "" || ProjectTypes.IsKnownProjectType(project.ProjectType))
        {
            return;
        }

        const diagnostic = new vscode.Diagnostic(
            project.GetProjectTypeRange(),
            `The project type {"${project.ProjectType}"} is unknown.`,
            vscode.DiagnosticSeverity.Error);

        this.diagnostics.push(diagnostic);
    }

    private CheckForMissingEndTag(project: Project): void
    {
        if(project.Start.line !== project.End.line)
        {
            return;
        }

        const diagnostic = new vscode.Diagnostic(
            project.Line.range,
            `The project module has no ENDPROJECT tag`,
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

    private CheckForEmptyLines(textLine: vscode.TextLine, textDocument: vscode.TextDocument): void
    {
        // don't check last empty new line
        if(textLine.lineNumber === (textDocument.lineCount - 1))
        {
            return;
        }

        const text = textLine.text.trim();

        if(text.length !== 0)
        {
            return;
        }

        const diagnostic = new vscode.Diagnostic(
            textLine.range,
            `This line is empty and can removed`,
            vscode.DiagnosticSeverity.Information);

        this.diagnostics.push(diagnostic);
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

    private CheckForNotFoundProjectSolutionFiles(project: Project, document: vscode.TextDocument): void
    {
        for (const solutionFileText of project.SolutionItems)
        {
            const split = solutionFileText.text.split("=");
            if(split.length < 2)
            {
                continue;
            }

            let filePath = split[1].trim();

            if(!path.isAbsolute(filePath))
            {
                if(project.IsSolutionFolder())
                {
                    const dir = path.dirname(document.fileName);
                    filePath = path.join(dir, filePath);
                }
                else
                {
                    filePath = path.join(project.AbsolutePath, filePath);
                }
            }

            try
            {
                fs.accessSync(filePath, constants.R_OK)
            }
            catch
            {
                const characterStart = solutionFileText.text.lastIndexOf(split[1].trim());

                const diagnostic = new vscode.Diagnostic(
                    this.GetRange(solutionFileText, characterStart, split[1].trim()),
                    `File "${filePath}" not found`,
                    vscode.DiagnosticSeverity.Error);
                    
                this.diagnostics.push(diagnostic);
            }
        }
    }

    private CheckForUniqueSolutionGuid(solution: Solution): void
    {
        const extensibilityglobals = SolutionHelper.GetGlobalSection(solution, Keyword.ExtensibilityGlobals);
        if(extensibilityglobals === undefined)
        {
            return;
        }

        let solutionGuid: string|undefined;
        let textLine: vscode.TextLine|undefined;

        for(let [line, key, value] of extensibilityglobals.KeyValueList)
        {
            if(key.toLowerCase() !== Properties.SolutionGuid.toLowerCase())
            {
                continue;
            }

            solutionGuid = value.replace('{', '').replace('}','').trim().toUpperCase();
            textLine = line;
            break;
        }

        if(solutionGuid === undefined || textLine === undefined)
        {
            return;
        }

        const project = solution.Projects.find(project => project.Guid.toUpperCase() === solutionGuid);
        if(project !== undefined)
        {
            const diagnostic = new vscode.Diagnostic(
                VscodeHelper.GetRange(textLine, solutionGuid, solutionGuid),
                `Solution GUID is already used by project "${project.Name}" in line ${project.Line.lineNumber + 1}`,
                vscode.DiagnosticSeverity.Error);
    
            this.diagnostics.push(diagnostic);
        }

        if(ProjectTypes.IsKnownProjectType(solutionGuid))
        {
            const diagnostic = new vscode.Diagnostic(
                VscodeHelper.GetRange(textLine, solutionGuid, solutionGuid),
                `Solution GUID is reversed for project type "${ProjectTypes.GetProjectTypeName(solutionGuid)}`,
                vscode.DiagnosticSeverity.Error);
    
            this.diagnostics.push(diagnostic);
        }
    }

    private CheckForMissingProjectParameter(project: Project): void
    {
        if(project.ProjectType === "")
        {
            const diagnostic = new vscode.Diagnostic(
                project.Line.range,
                `Project in line ${project.Line.lineNumber + 1} must have a project type (GUID).`,
                vscode.DiagnosticSeverity.Error);

            this.diagnostics.push(diagnostic);
        }

        if(project.Name === "")
        {
            const diagnostic = new vscode.Diagnostic(
                project.Line.range,
                `Project in line ${project.Line.lineNumber + 1} must have a name.`,
                vscode.DiagnosticSeverity.Error);

            this.diagnostics.push(diagnostic);
        }

        if(project.RelativePath === "")
        {
            const diagnostic = new vscode.Diagnostic(
                project.Line.range,
                `Project in line ${project.Line.lineNumber + 1} must have a path.`,
                vscode.DiagnosticSeverity.Error);

            this.diagnostics.push(diagnostic);
        }

        if(project.Guid === "")
        {
            const diagnostic = new vscode.Diagnostic(
                project.Line.range,
                `Project in line ${project.Line.lineNumber + 1} must have a identifier (GUID).`,
                vscode.DiagnosticSeverity.Error);

            this.diagnostics.push(diagnostic);
        }
    }

    private CheckForMissingVersionLines(solution: Solution): void
    {
        if(solution.FileFormat === undefined)
        {
            const diagnostic = new vscode.Diagnostic(
                VscodeHelper.GetEmptyRange(),
                `The solution must have a line with the version of the file format`
                + `\n(e.g. Microsoft Visual Studio Solution File, Format Version 12.00)`,
                vscode.DiagnosticSeverity.Error);

            this.diagnostics.push(diagnostic);
        }

        if(solution.VersionComment === undefined)
        {
            const diagnostic = new vscode.Diagnostic(
                VscodeHelper.GetEmptyRange(),
                `The solution should have a comment line with the major Visual Studio version`
                + `\n(e.g. # Visual Studio Version 16)`,
                vscode.DiagnosticSeverity.Information);

            this.diagnostics.push(diagnostic);
        }

        if(solution.StudioVersion === undefined)
        {
            const diagnostic = new vscode.Diagnostic(
                VscodeHelper.GetEmptyRange(),
                `The solution should have a line with the Visual Studio version`
                + `\n(e.g. VisualStudioVersion = 16.0.28315.86)`,
                vscode.DiagnosticSeverity.Warning);

            this.diagnostics.push(diagnostic);
        }

        if(solution.MinimumStudioVersion === undefined)
        {
            const diagnostic = new vscode.Diagnostic(
                VscodeHelper.GetEmptyRange(),
                `The solution should have a line with minimal supported Visual Studio version`
                + `\n(e.g. MinimumVisualStudioVersion = 10.0.40219.1)`,
                vscode.DiagnosticSeverity.Warning);

            this.diagnostics.push(diagnostic);
        }
    }

    private GetRange(textLine: vscode.TextLine, characterStart: number, word: string): vscode.Range
    {
        var characterEnd = characterStart + word.length;

        var start = new vscode.Position(textLine.lineNumber, characterStart);
        var end = new vscode.Position(textLine.lineNumber, characterEnd);

        return new vscode.Range(start, end);
    }

    private GetRangeStartEnd(textLine: vscode.TextLine, characterStart: number, characterEnd: number): vscode.Range
    {
        var start = new vscode.Position(textLine.lineNumber, characterStart);
        var end = new vscode.Position(textLine.lineNumber, characterEnd);

        return new vscode.Range(start, end);
    }
}