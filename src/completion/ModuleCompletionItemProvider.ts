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
            let beforeFirstModule = true;
            
            for(let lineNumber = (position.line - 1); lineNumber > 0; lineNumber--)
            {
                const line = document.lineAt(lineNumber).text.trim().toLowerCase();

                if(line.startsWith("endproject") && !line.startsWith("endprojectsection"))
                {
                    beforeFirstModule = false;
                    break;
                }

                if(line.startsWith("endglobal") && !line.startsWith("endglobalsection"))
                {
                    beforeFirstModule = false;
                    break;
                }

                if(line.startsWith("projectsection"))
                {
                    inProjectSection = true;
                    beforeFirstModule = false;
                    break;
                }
                
                if(line.startsWith("globalsection"))
                {
                    inGlobalSection = true;
                    beforeFirstModule = false;
                    break;
                }
                
                if(line.startsWith("project") || line.startsWith("endprojectsection"))
                {
                    inProject = true;
                    beforeFirstModule = false;
                    break;
                }
                if(line.startsWith("global") || line.startsWith("endglobalsection"))
                {
                    inGlobal = true;
                    beforeFirstModule = false;
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
            else if(beforeFirstModule)
            {
                list.push(...this.GetVersionHeaderCompletion());
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

    private GetVersionHeaderCompletion(): Array<vscode.CompletionItem>
    {
        const list = new Array<vscode.CompletionItem>();

        const versionList = new Array<[number, string]>();

        versionList.push([2019, "Visual Studio 2019"]);
        versionList.push([2017, "Visual Studio 2017"]);
        versionList.push([2015, "Visual Studio 2015"]);
        versionList.push([2013, "Visual Studio 2013"]);
        versionList.push([2012, "Visual Studio 2012"]);
        versionList.push([2010, "Visual Studio 2010"]);
        versionList.push([2008, "Visual Studio 2008"]);
        versionList.push([2005, "Visual Studio 2005"]);
        versionList.push([2003, "Visual Studio .NET 2003"]);

        for(const [version, text] of versionList)
        {
            let item = new vscode.CompletionItem(text, vscode.CompletionItemKind.Snippet);
            item.insertText = this.GetVersionHeaderText(version);
            item.preselect = version === 2019;
            list.push(item);
        }

        return list;
    }

    private GetVersionHeaderText(version: number): string
    {
        switch(version)
        {
            case 2019:
                return "Microsoft Visual Studio Solution File, Format Version 12.00\n"
                     + "# Visual Studio Version 16\n"
                     + "VisualStudioVersion = 16.0.28701.123\n" 
                     + "MinimumVisualStudioVersion = 10.0.40219.1";

            case 2017:
                return "Microsoft Visual Studio Solution File, Format Version 12.00\n"
                     + "# Visual Studio 15\n"
                     + "VisualStudioVersion = 15.0.26430.4\n"
                     + "MinimumVisualStudioVersion = 10.0.40219.1";

            case 2015:
                return "Microsoft Visual Studio Solution File, Format Version 12.00\n"
                     + "# Visual Studio 14\n"
                     + "VisualStudioVersion = 14.0.23107.0\n"
                     + "MinimumVisualStudioVersion = 10.0.40219.1";

            case 2013:
                return "Microsoft Visual Studio Solution File, Format Version 12.00\n"
                     + "# Visual Studio 2013\n"
                     + "VisualStudioVersion = 12.0.31101.0\n"
                     + "MinimumVisualStudioVersion = 10.0.40219.1";

            case 2012:
                return "Microsoft Visual Studio Solution File, Format Version 12.00\n"
                     + "# Visual Studio 2012\n"
                     + "VisualStudioVersion = 11.0"

            case 2010:
                return "Microsoft Visual Studio Solution File, Format Version 11.00\n"
                     + "# Visual Studio 2010\n"
                     + "VisualStudioVersion = 10.0"

            case 2008:
                return "Microsoft Visual Studio Solution File, Format Version 10.00\n"
                     + "# Visual Studio 2008\n"
                     + "VisualStudioVersion = 9.0"

            case 2005:
                return "Microsoft Visual Studio Solution File, Format Version 9.00\n"
                     + "# Visual Studio 2005\n"
                     + "VisualStudioVersion = 8.0"

            case 2003:
                return "Microsoft Visual Studio Solution File, Format Version 8.00\n"
                    + "# Visual Studio .NET 2003\n"
                    + "VisualStudioVersion = 7.1"
        }

        return "";
    }
}