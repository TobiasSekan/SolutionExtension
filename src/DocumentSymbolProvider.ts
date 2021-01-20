import * as vscode from 'vscode';
import { Solution } from './classes/Solution';

export class DocumentSymbolProvider  implements vscode.DocumentSymbolProvider
{
    provideDocumentSymbols(document: vscode.TextDocument, token: vscode.CancellationToken): vscode.ProviderResult<vscode.SymbolInformation[] | vscode.DocumentSymbol[]>
    {
        return new Promise<vscode.SymbolInformation[] | vscode.DocumentSymbol[]>((resolve, reject) =>
        {
            const list = new Array<vscode.SymbolInformation>();
            const solution = new Solution(document);

            for (const project of solution.Projects)
            {
                list.push(new vscode.SymbolInformation(
                    project.Name,
                    vscode.SymbolKind.Module,
                    project.GetProjectTypeName(),
                    new vscode.Location(document.uri, project.GetModuleRange())));

                for (const section of project.ProjectSections)
                {
                    list.push(new vscode.SymbolInformation(
                        `${section.Type}`,
                        vscode.SymbolKind.Array,
                        "",
                        new vscode.Location(document.uri, section.GetModuleRange())));
                }
            }

            if(solution.Global)
            {
                list.push(new vscode.SymbolInformation(
                    solution.Global.Type,
                    vscode.SymbolKind.Module,
                    "",
                    new vscode.Location(document.uri, solution.Global.GetModuleRange())));

                    for (const section of solution.Global.GlobalSections)
                    {
                        list.push(new vscode.SymbolInformation(
                            `${section.Type}`,
                            vscode.SymbolKind.Array,
                            "",
                            new vscode.Location(document.uri, section.GetModuleRange())));
                    }
            }

            resolve(list);
        });
    }
}