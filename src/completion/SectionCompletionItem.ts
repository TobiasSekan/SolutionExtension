import * as vscode from 'vscode';
import { ProjectCollector } from '../projects/ProjectCollector';

export class SectionCompletionItemProvider implements vscode.CompletionItemProvider
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
        return new Promise<vscode.CompletionItem[]|vscode.CompletionList>((resolve, rejects) =>
        {
            let inSection = false;

            for(let lineNumber = (position.line - 1); lineNumber > 0; lineNumber--)
            {
                const line = document.lineAt(lineNumber).text.trim().toLowerCase();

                if(line.startsWith("endglobalsection") || line.startsWith("endprojectsection"))
                {
                    rejects();
                }

                if(line.startsWith("globalsection") || line.startsWith("projectsection"))
                {
                    inSection = true;
                    break;
                }
            }

            if(!inSection)
            {
                rejects();
            }

            var guidList = new ProjectCollector(document, false).ProjectList;

            var list = new Array<vscode.CompletionItem>();

            for(const project of guidList)
            {
                const completionItem = new vscode.CompletionItem(project.Name, vscode.CompletionItemKind.Reference);
                completionItem.detail = `Guid: ${project.Guid}`
                completionItem.insertText = `{${project.Guid}}`;
                completionItem.documentation = `Project type: ${project.GetProjectTypeName()}\n\nPath:\n${project.GetProjectPath()}`;

                list.push(completionItem);
            }

            resolve(list);
        });
    }
}