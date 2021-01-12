import * as vscode from 'vscode';

export class PropertyProvider implements vscode.CompletionItemProvider
{
    private _valueList: Array<string>;

    constructor()
    {
        this._valueList = 
        [
            'HideSolutionNode',
            'SolutionGuid',
        ]
    }

    provideCompletionItems(
        document: vscode.TextDocument,
        position: vscode.Position,
        token: vscode.CancellationToken,
        context: vscode.CompletionContext): vscode.ProviderResult<vscode.CompletionItem[] | vscode.CompletionList>
    {
        var list = new Array<vscode.CompletionItem>();

        for(const name of this._valueList)
        {
            const completionItem = new vscode.CompletionItem(name, vscode.CompletionItemKind.Property);
            completionItem.commitCharacters = ["="];
            list.push(completionItem);
        }

        return list;
    }
}