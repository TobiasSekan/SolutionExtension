import * as vscode from 'vscode';

export class ValueProvider implements vscode.CompletionItemProvider
{
    private _valueList: Array<string>;

    constructor()
    {
        this._valueList = 
        [
            'Any|x64',
            'Debug|x64',
            'Debug|x86',
            'postProject',
            'postSolution',
            'preProject',
            'preSolution',
            'Release|x64',
            'Release|x86',
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
            const completionItem = new vscode.CompletionItem(name, vscode.CompletionItemKind.Value);
            list.push(completionItem);
        }


        list.push(new vscode.CompletionItem('TRUE', vscode.CompletionItemKind.Constant));
        list.push(new vscode.CompletionItem('FALSE', vscode.CompletionItemKind.Constant));

        return list;
    }
}