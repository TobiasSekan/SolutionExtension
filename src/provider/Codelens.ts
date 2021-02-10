import * as vscode from 'vscode';
import * as path from 'path';
import { ProjectCollector } from '../Projects/ProjectCollector';
import { Project } from '../Classes/Project';
import { ProjectTypes } from '../Projects/ProjectTypes';

export class CodelensProvider implements vscode.CodeLensProvider
{
    private codeLensList: Array<vscode.CodeLens>;

    public constructor()
    {
        this.codeLensList = new Array<vscode.CodeLens>();
    }

    public provideCodeLenses(document: vscode.TextDocument, token: vscode.CancellationToken)
        : vscode.CodeLens[] | Thenable<vscode.CodeLens[]>
    {
        return new Promise<vscode.CodeLens[]>((resolve, reject) =>
        {
            this.codeLensList.length = 0;

            if(!document)
            {
                reject();
            }

            const projectList = new ProjectCollector(document, true).ProjectList;

            for(const project of projectList)
            {
                this.AddCodeLensForProjectTypes(project);
                this.AddCodeLensForProjectFolders(project, document);
                this.AddCodeLensForNestedProjects(project, projectList);
            }

            let insideSelections = false;

            for (let lineNumber = 0; lineNumber < document.lineCount; lineNumber++)
            {
                const textLine = document.lineAt(lineNumber);
                const lowerCase = textLine.text.toLowerCase();

                if(lowerCase.indexOf("globalsection(") > -1
                || lowerCase.indexOf("projectsection(") > -1)
                {
                    insideSelections = true;
                }

                if(lowerCase.indexOf("endglobalsection") > -1
                || lowerCase.indexOf("endprojectsection") > -1)
                {
                    insideSelections = false;
                    continue;
                }

                if(!insideSelections)
                {
                    continue;
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

                    this.AddCodeLensForSolutionGuids(textLine, guidStart, guidEnd, projectList);

                    textPosition = guidEnd + 1;
                }
                while(textPosition < textLine.text.length)
            }

            resolve(this.codeLensList);
        });
    }

    public resolveCodeLens(codeLens: vscode.CodeLens, token: vscode.CancellationToken): vscode.ProviderResult<vscode.CodeLens>
    {
        return codeLens;
    }

    private AddCodeLensForSolutionGuids(textLine: vscode.TextLine, guidStart: number, guidEnd: number, projectList: Array<Project>): void
    {
        const guidToCheck = textLine.text.substr(guidStart, guidEnd - guidStart);

        const project = projectList.find(found => found.Guid === guidToCheck);
        if(!project)
        {
            return;
        }

        const startPosition = new vscode.Position(textLine.lineNumber, guidStart);
        const endPosition = new vscode.Position(textLine.lineNumber, guidEnd);
        const range = new vscode.Range(startPosition, endPosition)

        const command: vscode.Command =
        {
            command: "solutionExtension.gotoRange",
            tooltip: "Jump to project line",
            title: project.Name,
            arguments: [project.Line.range],
        }

        const codeLens = new vscode.CodeLens(range, command);

        this.codeLensList.push(codeLens);
    }

    private AddCodeLensForProjectTypes(project: Project): void
    {
        const typeName = ProjectTypes.GetProjectTypeName(project.ProjectType);

        const command: vscode.Command =
        {
            command : "",
            title: `Type: ${typeName}`,
        }

        const codeLens = new vscode.CodeLens(project.Line.range, command);
        this.codeLensList.push(codeLens);
    }

    private AddCodeLensForProjectFolders(project: Project, textDocument: vscode.TextDocument): void
    {
        if(project.IsSolutionFolder())
        {
            return;
        }

        const dir = path.dirname(project.AbsolutePath);
        const folderName = project.GetProjectFolder();

        const  command: vscode.Command =
        {
            arguments : [vscode.Uri.file(dir)],
            command : "solutionExtension.openFolder",
            title: `Folder: "${folderName}"`,
            tooltip : `Open project folder: ${dir}`,
        }

        const codeLens = new vscode.CodeLens(project.Line.range, command);
        this.codeLensList.push(codeLens);
    }

    private AddCodeLensForNestedProjects(project: Project, projectList: Array<Project>): void
    {
        for (const [line, nestedProjectGuid] of project.NestedInProjects)
        {
            const nestedInProject = projectList.find(found => found.Guid == nestedProjectGuid);
            if(!nestedInProject)
            {
                continue;
            }

            const command: vscode.Command =
            {
                arguments: [line.range],
                command: "solutionExtension.gotoRange",
                title: `Nested in "${nestedInProject.Name}"`,
                tooltip: "Jump to nested configuration line",
            }

            const codeLens = new vscode.CodeLens(project.Line.range, command);
            this.codeLensList.push(codeLens);
        }
    }
}