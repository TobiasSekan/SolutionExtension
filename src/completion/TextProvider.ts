import * as vscode from 'vscode';
import { guidCollector } from '../guidCollector';

export class TextProvider implements vscode.CompletionItemProvider
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
        var guidList = new guidCollector().CollectAllProjectGuid(document);

        var list = new Array<vscode.CompletionItem>();

        for(const project of guidList)
        {
            const completionItem = new vscode.CompletionItem(project.guid, vscode.CompletionItemKind.Reference);
            completionItem.detail = project.name
            completionItem.documentation = project.getProjectType() + "\n\n" + project.path;

            list.push(completionItem);
        }

        return list;
    }
}