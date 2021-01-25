import * as vscode from 'vscode';
import { ProjectCollector } from '../projects/ProjectCollector';

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
            if(context.triggerCharacter === undefined)
            {
                rejects();
            }

            const list = new Array<vscode.CompletionItem>();
            const valueList = new Array<[string, vscode.CompletionItemKind]>();

            let line = document.lineAt(position).text.trim().toLowerCase();

            let inGlobalSection = false;
            let inProjectDependencies = false;
            let InNestedProjects = false;
            let inConfigurationPlatforms = false;

            if(line.startsWith("globalsection"))
            {
                valueList.push(['preSolution', vscode.CompletionItemKind.Value]);
                valueList.push(['postSolution', vscode.CompletionItemKind.Value]);
            }
            else if(line.startsWith("projectsection"))
            {
                valueList.push(['preProject', vscode.CompletionItemKind.Value]);
                valueList.push(['postProject', vscode.CompletionItemKind.Value]);
            }
            else
            {

                for(let lineNumber = (position.line - 1); lineNumber > 0; lineNumber--)
                {
                    line = document.lineAt(lineNumber).text.trim().toLowerCase();

                    if(line.startsWith("endglobalsection")
                    || line.startsWith("endprojectsection")
                    || line.startsWith("globalsection(sharedmsbuildprojectfiles)"))
                    {
                        rejects();
                    }

                    if(line.startsWith("projectsection(projectdependencies)"))
                    {
                        inProjectDependencies = true;
                        break;
                    }

                    if(line.startsWith("globalsection(nestedprojects)"))
                    {
                        InNestedProjects = true;
                        break;
                    }

                    if(line.startsWith("globalsection(projectconfigurationplatforms)")
                    || line.startsWith("globalsection(solutionconfigurationplatforms)"))
                    {
                        inConfigurationPlatforms = true;
                        break;
                    }

                    if(line.startsWith("globalsection"))
                    {
                        inGlobalSection = true;
                        break;
                    }
                }
            }

            if(inConfigurationPlatforms)
            {
                valueList.push(['Debug|Any CPU', vscode.CompletionItemKind.Value]);
                valueList.push(['Debug|ARM', vscode.CompletionItemKind.Value]);
                valueList.push(['Debug|ARM64', vscode.CompletionItemKind.Value]);
                valueList.push(['Debug|x64', vscode.CompletionItemKind.Value]);
                valueList.push(['Debug|x86', vscode.CompletionItemKind.Value]);
                valueList.push(['Release|Any CPU', vscode.CompletionItemKind.Value]);
                valueList.push(['Release|ARM', vscode.CompletionItemKind.Value]);
                valueList.push(['Release|ARM64', vscode.CompletionItemKind.Value]);
                valueList.push(['Release|x64', vscode.CompletionItemKind.Value]);
                valueList.push(['Release|x86', vscode.CompletionItemKind.Value]);
            }
            
            if(inGlobalSection)
            {
                valueList.push(['TRUE', vscode.CompletionItemKind.Constant]);
                valueList.push(['FALSE', vscode.CompletionItemKind.Constant]);
            }

            for(const [name, kind] of valueList)
            {
                const completionItem = new vscode.CompletionItem(name, kind);
                completionItem.insertText = ` ${name}`;
                list.push(completionItem);
            }

            if(inProjectDependencies || InNestedProjects)
            {
                const guidList = new ProjectCollector(document, false).ProjectList;

                for(const project of guidList)
                {
                    const completionItem = new vscode.CompletionItem(project.Name, vscode.CompletionItemKind.Reference);
                    completionItem.detail = `Guid: ${project.Guid}`
                    completionItem.insertText = ` {${project.Guid}}`;
                    completionItem.documentation = `Project type: ${project.GetProjectTypeName()}\n\nPath:\n${project.GetProjectPath()}`;

                    list.push(completionItem);
                }
            }

            resolve(list);
        });
    }
}