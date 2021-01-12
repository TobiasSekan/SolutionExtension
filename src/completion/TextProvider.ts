import * as vscode from 'vscode';
import { guidCollector } from '../guidCollector';

export class TextProvider implements vscode.CompletionItemProvider
{
    private _surroundedWithQuotes: boolean;

    constructor(surroundedWithQuotes : boolean)
    {
        this._surroundedWithQuotes = surroundedWithQuotes;
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
            completionItem.commitCharacters = ["\""];
            completionItem.detail = project.name
            completionItem.documentation = project.getProjectType() + "\n\n" + project.path;

            if(this._surroundedWithQuotes)
            {
                completionItem.insertText = "{" + project.guid + "}\""
            }
            else
            {
                completionItem.insertText = project.guid + "}"
            }

            list.push(completionItem);
        }

        return list;
    }
}