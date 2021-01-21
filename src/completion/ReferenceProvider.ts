import * as vscode from 'vscode';
import { ProjectCollector } from '../projects/ProjectCollector';

export class CompletionReferenceProvider implements vscode.CompletionItemProvider
{
    constructor()
    {
    }

    provideCompletionItems(
        document: vscode.TextDocument,
        position: vscode.Position,
        token: vscode.CancellationToken,
        context: vscode.CompletionContext): vscode.ProviderResult<vscode.CompletionItem[] | vscode.CompletionList>
    {
        var guidList = new ProjectCollector(document, false).ProjectList;

        var list = new Array<vscode.CompletionItem>();

        for(const project of guidList)
        {
            const completionItem = new vscode.CompletionItem(project.Name, vscode.CompletionItemKind.Reference);
            completionItem.detail = `Guid: ${project.Guid}`
            completionItem.documentation = `Project type: ${project.GetProjectTypeName()}\n\nPath:\n${project.GetProjectPath()}`;

            list.push(completionItem);
        }

        return list;
    }
}