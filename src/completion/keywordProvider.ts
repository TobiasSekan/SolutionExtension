import * as vscode from 'vscode';

export class KeywordProvider implements vscode.CompletionItemProvider
{
    private _keywordList: Array<string>;

    constructor()
    {
        this._keywordList = 
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
    }

    provideCompletionItems(
        document: vscode.TextDocument,
        position: vscode.Position,
        token: vscode.CancellationToken,
        context: vscode.CompletionContext): vscode.ProviderResult<vscode.CompletionItem[] | vscode.CompletionList>
    {
        var list = new Array<vscode.CompletionItem>();

        for(const name of this._keywordList)
        {
            const completionItem = new vscode.CompletionItem(name, vscode.CompletionItemKind.Keyword);
            completionItem.commitCharacters = [")"];
            list.push(completionItem);
        }

        return list;
    }
}