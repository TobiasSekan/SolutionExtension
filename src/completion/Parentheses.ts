import * as vscode from 'vscode';
import { ProjectCollector } from '../projects/ProjectCollector';
import { ProjectTypes } from '../projects/ProjectTypes';

export class ParenthesesCompletionItemProvider implements vscode.CompletionItemProvider
{
    provideCompletionItems(
        document: vscode.TextDocument,
        position: vscode.Position,
        token: vscode.CancellationToken,
        context: vscode.CompletionContext): vscode.ProviderResult<vscode.CompletionItem[] | vscode.CompletionList>
    {
        return new Promise<vscode.CompletionItem[]|vscode.CompletionList>((resolve, rejects) =>
        {
            const word = document.lineAt(position).text.trimLeft().toLowerCase();
            const list = new Array<vscode.CompletionItem>();

            if(word.startsWith("globalsection") || word.startsWith("projectsection"))
            {
                const keywords =
                [
                    `ExtensibilityAddIns`,
                    'ExtensibilityGlobals',
                    'NestedProjects',
                    'ProjectConfigurationPlatforms',
                    'ProjectDependencies',
                    'SharedMSBuildProjectFiles',
                    'SolutionConfigurationPlatforms',
                    'SolutionItems',
                    `SolutionNotes`,
                    'SolutionProperties',
                ]

                for(const keyword of keywords)
                {
                    const completionItem = new vscode.CompletionItem(keyword, vscode.CompletionItemKind.Keyword);
                    completionItem.commitCharacters = [")"];
                    list.push(completionItem);
                }

            }
            else if(word.startsWith("project"))
            {
                var projectList = new ProjectCollector(document, false).ProjectList;
                var projectTypeList = ProjectTypes.GetAllProjectTypes();

                for(const [typeGuid, typeName] of projectTypeList)
                {
                    var countOfUses = projectList.filter(found => found.ProjectType === typeGuid).length;

                    const completionItem = new vscode.CompletionItem(typeName, vscode.CompletionItemKind.TypeParameter);
                    completionItem.detail = `Guid: ${typeGuid}`;
                    completionItem.insertText = `"{${typeGuid}}"`;
                    completionItem.documentation = `${countOfUses} projects with this type in this file`;

                    list.push(completionItem);
                }
            }
            else
            {
                rejects();
            }

            resolve(list);
        });
    }
}