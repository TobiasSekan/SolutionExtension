import * as vscode from 'vscode';
import { ProjectCollector } from '../projects/ProjectCollector';

export class ReferenceProvider implements vscode.CompletionItemProvider
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
        var guidList = new ProjectCollector().CollectAllProjectGuid(document);

        var list = new Array<vscode.CompletionItem>();

        for(const project of guidList)
        {
            const completionItem = new vscode.CompletionItem(project.name, vscode.CompletionItemKind.Reference);
            completionItem.detail = `Guid: ${project.guid}`
            completionItem.documentation = `Project type: ${project.getProjectTypeName()}\n\nPath:\n${project.getProjectPath()}`;

            list.push(completionItem);
        }

        return list;
    }
}