import * as fs from 'fs';
import { constants } from 'fs';
import * as vscode from 'vscode';
import { Project } from './projects/Project';
import { ProjectCollector } from './projects/ProjectCollector';

export class guidDiagnostic
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

    public updateDiagnostics(document: vscode.TextDocument): void
    {
        if (!document)
        {
            this.collection.clear();
        }

        this.diagnostics.length = 0;

        const projectList = new ProjectCollector().CollectAllProjectGuid(document);

        this.CheckForDoubleUsedProjectGuid(document);
        this.CheckForMissingProjectGuid(document, projectList);
        
        this.collection.set(document.uri, this.diagnostics);
        
        this.CheckForNotFoundProjectFiles(document, projectList);
    }

    private CheckForMissingProjectGuid(document: vscode.TextDocument, projectList: Array<Project>): void
    {
        for (let lineNumber = 0; lineNumber < document.lineCount; lineNumber++)
        {
            const line = document.lineAt(lineNumber);
            const lineText = line.text;

            // ignore lines with projects and line solution guid
            if(lineText.startsWith("Project(") || lineText.indexOf("SolutionGuid") > -1)
            {
                continue;
            }

            // ignore lines than don't contain a guid
            if(lineText.indexOf("{") < 0 || lineText.indexOf("}") < 0)
            {
                continue;
            }

            let textPosition = 0;

            do
            {
                const guidStart = lineText.indexOf("{", textPosition) + 1;
                const guidEnd = lineText.indexOf("}", textPosition);

                if(guidStart == -1 || guidEnd == -1)
                {
                    break;
                }

                const guidToCheck = lineText.substr(guidStart, guidEnd - guidStart);

                if(projectList.findIndex(found => found.guid == guidToCheck) < 0)
                {
                    const startPosition = new vscode.Position(lineNumber, guidStart);
                    const endPosition = new vscode.Position(lineNumber, guidEnd)

                    const diagnostic = new vscode.Diagnostic(
                        new vscode.Range(startPosition, endPosition),
                        "Guid " + guidToCheck + " is not a project guid",
                        vscode.DiagnosticSeverity.Error)

                    this.diagnostics.push(diagnostic);
                }

                textPosition = guidEnd + 1;
            }
            while(textPosition < lineText.length)
        }
    }

    private CheckForDoubleUsedProjectGuid(document: vscode.TextDocument): void
    {
        const guidList = new Array<string>();

        let insideNestedProjects = false;

        for (let lineNumber = 0; lineNumber < document.lineCount; lineNumber++)
        {
            const line = document.lineAt(lineNumber);
            const lineText = line.text;

            if(lineText.indexOf("GlobalSection(NestedProjects)") > -1)
            {
                insideNestedProjects = true;
                continue;
            }

            if(lineText.indexOf("EndGlobalSection") > -1)
            {
                insideNestedProjects = false;
                continue;
            }

            if(!insideNestedProjects)
            {
                continue;
            }

            const guidStart = lineText.indexOf("{",) + 1;
            const guidEnd = lineText.indexOf("}");

            if(guidStart == -1 || guidEnd == -1)
            {
                break;
            }

            const guidToCheck = lineText.substr(guidStart, guidEnd - guidStart);

            if(guidList.includes(guidToCheck))
            {
                const startPosition = new vscode.Position(lineNumber, guidStart);
                const endPosition = new vscode.Position(lineNumber, guidEnd)
                
                const diagnostic = new vscode.Diagnostic(
                    new vscode.Range(startPosition, endPosition),
                    "Guid " + guidToCheck + " is already used",
                    vscode.DiagnosticSeverity.Warning)
                    
                    this.diagnostics.push(diagnostic);
            }

            guidList.push(guidToCheck);
        }
    }

    private CheckForNotFoundProjectFiles(document: vscode.TextDocument, projectList: Array<Project>): void
    {
        for (const project of projectList)
        {
            if(project.IsSolutionFolder())
            {
                continue;
            }

            fs.access(project.absolutePath, constants.R_OK, (error) =>
            {
                if(!error)
                {
                    return;
                }

                const diagnostic = new vscode.Diagnostic(
                    project.getPathRange(),
                    "File " +  project.relativePath + " not found",
                    vscode.DiagnosticSeverity.Error);
                    
                this.diagnostics.push(diagnostic);
                this.collection.set(document.uri, this.diagnostics);
            });
        }
    }
}