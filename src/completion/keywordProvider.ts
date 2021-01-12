import * as vscode from 'vscode';

export class KeywordProvider implements vscode.CompletionItemProvider
{
    private _keywordList: Array<string>;

    constructor()
    {
        this._keywordList = 
        [
            'postProject',
            'preProject',
            'Any|x64',
            'Debug|x64',
            'Release|x64',
            'FALSE',
            'TRUE',
        ]
    }

    provideCompletionItems(
        document: vscode.TextDocument,
        position: vscode.Position,
        token: vscode.CancellationToken,
        context: vscode.CompletionContext): vscode.ProviderResult<vscode.CompletionItem[] | vscode.CompletionList>
    {
        var list = new Array<vscode.CompletionItem>();

        for(const name of this._keywordList)
        {
            const completionItem = new vscode.CompletionItem(name, vscode.CompletionItemKind.Keyword);
            list.push(completionItem);
        }

        return list;
    }
}