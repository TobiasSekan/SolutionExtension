import * as vscode from 'vscode';
import { Project } from './classes/Project';
import { Solution } from './classes/Solution';

export class DefinitionProvider implements vscode.DefinitionProvider
{
    provideDefinition(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken): vscode.ProviderResult<vscode.Location | vscode.Location[] | vscode.LocationLink[]>
    {
        return new Promise<vscode.Location | vscode.Location[] | vscode.LocationLink[]>((resolve, reject) =>
        {
            const solution = new Solution(document);

            for (const project of solution.Projects)
            {
                for(const globalSection of project.ProjectSections)
                {
                    for(let [line, left, right] of globalSection.KeyValueList)
                    {
                        if(line.lineNumber != position.line)
                        {
                            continue;
                        }

                        const leftStart = line.text.indexOf(left);
                        const rightStart = line.text.lastIndexOf(right);

                        let project: Project|undefined;

                        if(position.character >= rightStart && position.character <= (rightStart + right.length))
                        {
                            project = solution.Projects.find(found => found.Guid === right);
                        }
                        else if(position.character >= leftStart && position.character <= (leftStart + left.length))
                        {
                            project = solution.Projects.find(found => found.Guid === left);
                        }

                        if(project)
                        {
                            resolve(new vscode.Location(document.uri, project.Line.range));
                        }
                    }
                }
            }

            if(!solution.Global)
            {
                return;
            }

            for(const globalSection of solution.Global.GlobalSections)
            {
                for(let [line, left, right] of globalSection.KeyValueList)
                {
                    if(line.lineNumber != position.line)
                    {
                        continue;
                    }

                    // special handling when in PlatformConfigurations
                    if(left.indexOf('.') > -1)
                    {
                        left = left.split('.')[0].trim();
                    }

                    const leftStart = line.text.indexOf(left);
                    const rightStart = line.text.lastIndexOf(right);

                    let project: Project|undefined;

                    if(position.character >= rightStart && position.character <= (rightStart + right.length))
                    {
                        project = solution.Projects.find(found => found.Guid === right);
                    }
                    else if(position.character >= leftStart && position.character <= (leftStart + left.length))
                    {
                        project = solution.Projects.find(found => found.Guid === left);
                    }

                    if(project)
                    {
                        resolve(new vscode.Location(document.uri, project.Line.range));
                    }
                }
            }

            reject("guid not found");
        });
    }
}