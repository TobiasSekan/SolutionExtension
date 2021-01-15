import * as vscode from 'vscode';
import { ProjectCollector } from './projects/ProjectCollector';
import { Project } from './projects/Project';
import { ProjectTypes } from './projects/ProjectTypes';

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
            if(!document)
            {
                reject();
            }

            this.codeLensList.length = 0;

            const projectList = new ProjectCollector(document, true).ProjectList;

            let insideSelections = false;

            for (let lineNumber = 0; lineNumber < document.lineCount; lineNumber++)
            {
                const textLine = document.lineAt(lineNumber);
                const lowerCase = textLine.text.toLowerCase();

                let insideProject = false;

                if(lowerCase.indexOf("globalsection(") > -1
                || lowerCase.indexOf("projectsection(") > -1)
                {
                    insideSelections = true;
                }

                if(lowerCase.indexOf("project(") > -1)
                {
                    insideProject = true;
                }

                if(lowerCase.indexOf("endglobalsection") > -1
                || lowerCase.indexOf("endprojectsection") > -1)
                {
                    insideSelections = false;
                    continue;
                }

                if(!insideProject && !insideSelections)
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

                    if(insideSelections)
                    {
                        this.AddCodeLensForSolutionGuids(textLine, guidStart, guidEnd, projectList);
                    }

                    if(insideProject)
                    {
                        this.AddCodeLensForProjectGuids(textLine, guidStart, guidEnd);
                    }

                    textPosition = guidEnd + 1;
                }
                while(textPosition < textLine.text.length && !insideProject)
            }

            this.AddCodeLensForNestedProjects(projectList);

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

        const codeLens = this.GetCodeLensForSolutionGuids(project, textLine, guidStart, guidEnd)

        this.codeLensList.push(codeLens);
    }

    private GetCodeLensForSolutionGuids(project: Project, textLine: vscode.TextLine, guidStart: number, guidEnd: number)
    {
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

        return new vscode.CodeLens(range, command);
    }

    private AddCodeLensForProjectGuids(textLine: vscode.TextLine, guidStart: number, guidEnd: number): void
    {
        const projectGuid = textLine.text.substr(guidStart, guidEnd - guidStart);

        const typeName = ProjectTypes.GetProjectTypeName(projectGuid);

        const command: vscode.Command =
        {
            command: "",
            title: `Project type: ${typeName}`,
        }

        const codeLens = new vscode.CodeLens(textLine.range, command);

        this.codeLensList.push(codeLens);
    }

    private AddCodeLensForNestedProjects(projectList: Array<Project>): void
    {
        for(const project of projectList)
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
                    command: "solutionExtension.gotoRange",
                    tooltip: "Jump to nested configuration line",
                    title: `"${project.Name}" is nested in "${nestedInProject.Name}"`,
                    arguments: [line.range],
                }

                const codeLens = new vscode.CodeLens(project.Line.range, command);
                this.codeLensList.push(codeLens);
            }
        }
    }
}