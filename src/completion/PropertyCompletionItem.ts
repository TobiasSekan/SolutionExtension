import * as vscode from 'vscode';

export class PropertyCompletionItemProvider implements vscode.CompletionItemProvider
{
    provideCompletionItems(
        document: vscode.TextDocument,
        position: vscode.Position,
        token: vscode.CancellationToken,
        context: vscode.CompletionContext): vscode.ProviderResult<vscode.CompletionItem[] | vscode.CompletionList>
    {
        return new Promise<vscode.CompletionItem[]|vscode.CompletionList>((resolve, rejects) =>
        {
            let inExtensibilityGlobals = false;
            let inSolutionConfigurationPlatforms = false;
            let inSolutionProperties = false;

            for(let lineNumber = (position.line - 1); lineNumber > 0; lineNumber--)
            {
                const line = document.lineAt(lineNumber).text.trim().toLowerCase();

                if(line.startsWith("globalsection(sharedmsbuildprojectfiles)")
                || line.startsWith("globalsection(projectconfigurationplatforms)")
                || line.startsWith("globalsection(nestedprojects)")
                || line.startsWith("endglobalsection"))
                {
                    rejects();
                    return;
                }

                if(line.startsWith("globalsection(extensibilityglobals)"))
                {
                    inExtensibilityGlobals = true;
                    break;
                }

                if(line.startsWith("globalsection(solutionconfigurationplatforms)"))
                {
                    inSolutionConfigurationPlatforms = true;
                    break;
                }

                if(line.startsWith("globalsection(solutionproperties)"))
                {
                    inSolutionProperties = true;
                    break;
                }

                if(line.startsWith("globalsection"))
                {
                    break;
                }
            }

            const valueList = new Array<string>();
            const list = new Array<vscode.CompletionItem>();

            if(inExtensibilityGlobals)
            {
                valueList.push('SolutionGuid');
                valueList.push('RESX_SortFileContentOnSave');
            }

            if(inSolutionProperties)
            {
                valueList.push('HideSolutionNode');
            }

            if(inSolutionConfigurationPlatforms)
            {
                valueList.push('Debug|Any CPU');
                valueList.push('Debug|ARM');
                valueList.push('Debug|ARM64');
                valueList.push('Debug|x64');
                valueList.push('Debug|x86');
                valueList.push('Release|Any CPU');
                valueList.push('Release|ARM');
                valueList.push('Release|ARM64');
                valueList.push('Release|x64');
                valueList.push('Release|x86');
            }

            for(const name of valueList)
            {
                const completionItem = new vscode.CompletionItem(name, vscode.CompletionItemKind.Property);
                list.push(completionItem);
            }

            resolve(list);
        });
    }
}