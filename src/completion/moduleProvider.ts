import * as vscode from 'vscode';

export class ModuleProvider implements vscode.CompletionItemProvider
{
    private _nameModuleList: Array<string>;

    constructor()
    {
        this._nameModuleList = 
        [
            'Project',
            'ProjectSection',
            'Global',
            'GlobalSection',
        ]
    }

    provideCompletionItems(
        document: vscode.TextDocument,
        position: vscode.Position,
        token: vscode.CancellationToken,
        context: vscode.CompletionContext): vscode.ProviderResult<vscode.CompletionItem[] | vscode.CompletionList>
    {
        var list = new Array<vscode.CompletionItem>();

        for(const name of this._nameModuleList)
        {
            const snippetItem = new vscode.CompletionItem(name, vscode.CompletionItemKind.Snippet);
            snippetItem.insertText = `${name}\n\nEnd${name}`;
            list.push(snippetItem);

            const moduleItem = new vscode.CompletionItem(`End${name}`, vscode.CompletionItemKind.Module);
            list.push(moduleItem);
        }

        return list;
    }
}