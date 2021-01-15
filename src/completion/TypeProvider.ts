import * as vscode from 'vscode';
import { ProjectCollector } from '../projects/ProjectCollector';
import { ProjectTypes } from '../projects/ProjectTypes';

export class TypeProvider implements vscode.CompletionItemProvider
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
        var projectList = new ProjectCollector(document, false).ProjectList;
        var projectTypeList = ProjectTypes.GetAllProjectTypes();

        var list = new Array<vscode.CompletionItem>();

        for(const [typeGuid, typeName] of projectTypeList)
        {
            var countOfUses = projectList.filter(found => found.ProjectType === typeGuid).length;

            const completionItem = new vscode.CompletionItem(typeName, vscode.CompletionItemKind.TypeParameter);
            completionItem.detail = `Guid: ${typeGuid}`;
            completionItem.insertText = `{${typeGuid}}`;
            completionItem.documentation = `${countOfUses} projects with this type in this file`;

            list.push(completionItem);
        }

        return list;
    }
}