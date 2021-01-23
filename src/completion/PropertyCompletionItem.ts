import * as vscode from 'vscode';

export class PropertyCompletionItemProvider implements vscode.CompletionItemProvider
{
    private _valueList: Array<string>;

    constructor()
    {
        this._valueList = 
        [
            'HideSolutionNode',
            'RESX_SortFileContentOnSave',
            'SolutionGuid',
        ]
    }

    provideCompletionItems(
        document: vscode.TextDocument,
        position: vscode.Position,
        token: vscode.CancellationToken,
        context: vscode.CompletionContext): vscode.ProviderResult<vscode.CompletionItem[] | vscode.CompletionList>
    {
        return new Promise<vscode.CompletionItem[]|vscode.CompletionList>((resolve, rejects) =>
        {
            let inSection = false;

            for(let lineNumber = (position.line - 1); lineNumber > 0; lineNumber--)
            {
                const line = document.lineAt(lineNumber).text.trim().toLowerCase();

                if(line.startsWith("endglobalsection"))
                {
                    rejects();
                }

                if(line.startsWith("globalsection"))
                {
                    inSection = true;
                    break;
                }
            }

            if(!inSection)
            {
                rejects();
            }

            var list = new Array<vscode.CompletionItem>();

            for(const name of this._valueList)
            {
                const completionItem = new vscode.CompletionItem(name, vscode.CompletionItemKind.Property);
                completionItem.insertText = `${name} = `
                completionItem.commitCharacters = ["="];
                list.push(completionItem);
            }

            resolve(list);
        });
    }
}