import * as vscode from 'vscode';
import { Solution } from '../Classes/Solution';
import { Keyword } from '../Constants/Keyword';

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
            // only add theses completions values to the list,
            // when a user has typed a trigger character and not press ALT+ENTER or CTRL+.
            if(context.triggerCharacter === undefined)
            {
                rejects();
            }

            const list = new Array<vscode.CompletionItem>();
            const valueList = new Array<[string, vscode.CompletionItemKind]>();

            let inGlobalSection = false;
            let inProjectDependencies = false;
            let InNestedProjects = false;
            let inProjectConfigurationPlatforms = false;
            let inSolutionConfigurationPlatforms = false;

            let line = document.lineAt(position).text.trim().toLowerCase();

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

                    if(line.startsWith("globalsection(projectconfigurationplatforms)"))
                    {
                        inProjectConfigurationPlatforms = true;
                        break;
                    }

                    if(line.startsWith("globalsection(solutionconfigurationplatforms)"))
                    {
                        inSolutionConfigurationPlatforms = true;
                        break;
                    }

                    if(line.startsWith("globalsection"))
                    {
                        inGlobalSection = true;
                        break;
                    }
                }
            }

            if(inSolutionConfigurationPlatforms)
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

            if(inProjectDependencies || InNestedProjects || inProjectConfigurationPlatforms)
            {
                const solution = new Solution(document);

                if(inProjectDependencies || InNestedProjects)
                {
                    this.AddProjectsToCompletionList(solution, list);
                }

                if(inProjectConfigurationPlatforms)
                {
                    this.AddConfigurationsToCompletionList(solution, list);
                }
            }

            this.AddValuesToCompletionList(valueList, list);

            resolve(list);
        });
    }

    /**
     * Add all projects the a defined in the solution to the code completions list
     * @param solution The solution that contains the projects
     * @param completionList The list for the code completions
     */
    private AddProjectsToCompletionList(
        solution: Solution,
        completionList: Array<vscode.CompletionItem>): void
    {
        for(const project of solution.Projects)
        {
            const completionItem = new vscode.CompletionItem(
                project.Name,
                vscode.CompletionItemKind.Reference);

            completionItem.detail = `Guid: ${project.Guid}`;
            completionItem.insertText = ` {${project.Guid}}`;

            completionItem.documentation
                = `Project type: ${project.GetProjectTypeName()}\n\nPath:\n${project.GetProjectPath()}`;

            completionList.push(completionItem);
        }
    }

    /**
     * Add all configurations that are defined in the solution to the code completions list
     * @param solution The solution that contains the configurations
     * @param completionList The list for the code completions
     */
    private AddConfigurationsToCompletionList(
        solution: Solution,
        completionList: Array<vscode.CompletionItem>): void
    {
        const configurationPlatforms = solution.Global?.GlobalSections
            .find(section => section.Type == Keyword.SolutionConfigurationPlatforms);

        if(configurationPlatforms === undefined)
        {
            return;
        }

        for(const [, , value] of configurationPlatforms.KeyValueList)
        {
            const completionItem = new vscode.CompletionItem(value, vscode.CompletionItemKind.Value);
            completionItem.insertText = ` ${value}`;
            completionList.push(completionItem);
        }
    }

    /**
     * 
     * @param valueList The list with all values for the code completion list
     * @param completionList The list for the code completions
     */
    private AddValuesToCompletionList(
        valueList: Array<[string, vscode.CompletionItemKind]>,
        completionList: Array<vscode.CompletionItem>): void
    {
        for(const [name, kind] of valueList)
        {
            const completionItem = new vscode.CompletionItem(name, kind);
            completionItem.insertText = ` ${name}`;
            completionList.push(completionItem);
        }
    }
}