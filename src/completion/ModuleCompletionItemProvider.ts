import * as vscode from 'vscode';

export class ModuleCompletionItemProvider implements vscode.CompletionItemProvider
{
    provideCompletionItems(
        document: vscode.TextDocument,
        position: vscode.Position,
        token: vscode.CancellationToken,
        context: vscode.CompletionContext): vscode.ProviderResult<vscode.CompletionItem[] | vscode.CompletionList>
    {
        return new Promise<vscode.CompletionItem[] | vscode.CompletionList>((resolve, _) =>
        {
            let inProject = false;
            let inGlobal = false;
            let inProjectSection = false;
            let inGlobalSection = false;
            
            for(let lineNumber = (position.line - 1); lineNumber > 0; lineNumber--)
            {
                const line = document.lineAt(lineNumber).text.trim().toLowerCase();

                if(line.startsWith("endproject") && !line.startsWith("endprojectsection"))
                {
                    break;
                }

                if(line.startsWith("endglobal") && !line.startsWith("endglobalsection"))
                {
                    break;
                }

                if(line.startsWith("projectsection"))
                {
                    inProjectSection = true;
                    break;
                }

                if(line.startsWith("globalsection"))
                {
                    inGlobalSection = true;
                }

                if(line.startsWith("project") || line.startsWith("endprojectsection"))
                {
                    inProject = true;
                    break;
                }
                if(line.startsWith("global") || line.startsWith("endglobalsection"))
                {
                    inGlobal = true;
                    break;
                }
            }
            
            var list = new Array<vscode.CompletionItem>();

            if(inProject)
            {
                let item = new vscode.CompletionItem("ProjectSection", vscode.CompletionItemKind.Module);
                list.push(item);

                item = new vscode.CompletionItem(`EndProject`, vscode.CompletionItemKind.Module);
                list.push(item);
            }
            else if(inProjectSection)
            {
                const item = new vscode.CompletionItem(`EndProjectSection`, vscode.CompletionItemKind.Module);
                list.push(item);
            }
            else if(inGlobal)
            {
                let item = new vscode.CompletionItem("GlobalSection", vscode.CompletionItemKind.Module);
                list.push(item);

                item = new vscode.CompletionItem(`EndGlobal`, vscode.CompletionItemKind.Module);
                list.push(item);
            }
            else if(inGlobalSection)
            {
                const item = new vscode.CompletionItem(`EndGlobalSection`, vscode.CompletionItemKind.Module);
                list.push(item);
            }
            else
            {
                let item = new vscode.CompletionItem("Project", vscode.CompletionItemKind.Module);
                list.push(item);

                item = new vscode.CompletionItem("Global", vscode.CompletionItemKind.Module);
                list.push(item);
            }

            resolve(list);
        });
    }
}