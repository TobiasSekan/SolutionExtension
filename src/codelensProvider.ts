import * as vscode from 'vscode';
import { guidCollector } from './guidCollector';
import { Project } from './project';
import { projectTypes } from './projectTypes';

export class codelensProvider implements vscode.CodeLensProvider
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

            const projectList = new guidCollector().CollectAllProjectGuid(document);

            let insideSelections = false;

            for (let lineNumber = 0; lineNumber < document.lineCount; lineNumber++)
            {
                const line = document.lineAt(lineNumber);

                let insideProject = false;

                if(line.text.indexOf("GlobalSection(") > -1
                || line.text.indexOf("ProjectSection(") > -1)
                {
                    insideSelections = true;
                }

                if(line.text.indexOf("Project(") > -1)
                {
                    insideProject = true;
                }

                if(line.text.indexOf("EndGlobalSection") > -1
                || line.text.indexOf("EndProjectSection") > -1)
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
                    const guidStart = line.text.indexOf("{", textPosition) + 1;
                    const guidEnd = line.text.indexOf("}", textPosition);
            
                    if(guidStart == -1 || guidEnd == -1)
                    {
                        break;
                    }

                    if(insideSelections)
                    {
                        this.addCodeLensForSolutionGuids(line, guidStart, guidEnd, projectList);
                    }

                    if(insideProject)
                    {
                        this.addCodeLensForProjectGuids(line, guidStart, guidEnd);
                    }

                    textPosition = guidEnd + 1;
                }
                while(textPosition < line.text.length && !insideProject)
            }

            resolve(this.codeLensList);
        });
    }

    public resolveCodeLens(codeLens: vscode.CodeLens, token: vscode.CancellationToken): vscode.ProviderResult<vscode.CodeLens>
    {
        return codeLens;
    }

    private addCodeLensForSolutionGuids(textLine: vscode.TextLine, guidStart: number, guidEnd: number, projectList: Array<Project>): void
    {
        const guidToCheck = textLine.text.substr(guidStart, guidEnd - guidStart);

        const project = projectList.find(found => found.guid == guidToCheck);
        if(!project)
        {
            return;
        }

        if(project.guid == "D1D6BC88-09AE-4FB4-AD24-5DED46A791DD")
        {
            let test = 1200;
        }

        const codeLens = this.getCodeLensForSolutionGuids(project, textLine, guidStart, guidEnd)

        this.codeLensList.push(codeLens);
    }

    private getCodeLensForSolutionGuids(project: Project, textLine: vscode.TextLine, guidStart: number, guidEnd: number)
    {
        const startPosition = new vscode.Position(textLine.lineNumber, guidStart);
        const endPosition = new vscode.Position(textLine.lineNumber, guidEnd);
        const range = new vscode.Range(startPosition, endPosition)

        const command =
        {
            command: "",
            title: project.name,
        }

        return new vscode.CodeLens(range, command);
    }

    private addCodeLensForProjectGuids(textLine: vscode.TextLine, guidStart: number, guidEnd: number): void
    {
        const projectGuid = textLine.text.substr(guidStart, guidEnd - guidStart);

        if(projectGuid == "D1D6BC88-09AE-4FB4-AD24-5DED46A791DD")
        {
            let test = 1200;
        }

        const type = projectTypes.getProjectType(projectGuid);

        const codeLens = this.getCodeLensForProjectType(type, textLine, guidStart, guidEnd)

        this.codeLensList.push(codeLens);
    }

    private getCodeLensForProjectType(type: string, textLine: vscode.TextLine, guidStart: number, guidEnd: number)
    {
        const startPosition = new vscode.Position(textLine.lineNumber, guidStart);
        const endPosition = new vscode.Position(textLine.lineNumber, guidEnd);
        const range = new vscode.Range(startPosition, endPosition)

        const command =
        {
            command: "",
            title: type,
        }

        return new vscode.CodeLens(range, command);
    }
}