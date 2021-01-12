import * as vscode from 'vscode';

export class ValueProvider implements vscode.CompletionItemProvider
{
    private _valueList: Array<string>;

    constructor()
    {
        this._valueList = 
        [
            'ProjectDependencies',
            'SolutionItems',
            'SolutionConfigurationPlatforms',
            'ProjectConfigurationPlatforms',
            'SolutionProperties',
            'NestedProjects',
            'ExtensibilityGlobals',
        ]
    }

    provideCompletionItems(
        document: vscode.TextDocument,
        position: vscode.Position,
        token: vscode.CancellationToken,
        context: vscode.CompletionContext): vscode.ProviderResult<vscode.CompletionItem[] | vscode.CompletionList>
    {
        var list = new Array<vscode.CompletionItem>();

        for(const name of this._valueList)
        {
            const completionItem = new vscode.CompletionItem(name, vscode.CompletionItemKind.Value);
            completionItem.commitCharacters = [")"];
            list.push(completionItem);
        }

        return list;
    }
}