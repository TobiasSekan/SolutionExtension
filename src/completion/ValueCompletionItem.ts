import * as vscode from 'vscode';

export class ValueCompletionItemProvider implements vscode.CompletionItemProvider
{
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
            
            const valueList = 
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

            for(const name of valueList)
            {
                const completionItem = new vscode.CompletionItem(name, vscode.CompletionItemKind.Value);
                list.push(completionItem);
            }

            list.push(new vscode.CompletionItem('TRUE', vscode.CompletionItemKind.Constant));
            list.push(new vscode.CompletionItem('FALSE', vscode.CompletionItemKind.Constant));

            resolve(list);
        });
    }
}