import * as vscode from 'vscode';
import { ProjectCollector } from '../Projects/ProjectCollector';

export class WorkspaceSymbolProvider implements vscode.WorkspaceSymbolProvider
{
    provideWorkspaceSymbols(query: string, token: vscode.CancellationToken): vscode.ProviderResult<vscode.SymbolInformation[]>
    {
        return new Promise<vscode.SymbolInformation[]>((resolve, rejects) =>
        {
            if(vscode.window.activeTextEditor && vscode.window.activeTextEditor.document.languageId === "sln")
            {
                const list = new Array<vscode.SymbolInformation>();
                const document = vscode.window.activeTextEditor.document;
                const projectList = new ProjectCollector(document, false).ProjectList;

                for(const project of projectList)
                {
                    if(project.IsSolutionFolder())
                    {
                        continue;
                    }

                    const uri = vscode.Uri.file(project.AbsolutePath);
                    const location = new vscode.Location(uri, new vscode.Position(0, 0));

                    const symbolInformation = new vscode.SymbolInformation(
                        project.GetProjectFileName(),
                        vscode.SymbolKind.File,
                        "",
                        location);

                    list.push(symbolInformation);
                }

                resolve(list);
            }

            rejects();
        });
    }
}

