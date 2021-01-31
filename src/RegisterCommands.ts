import * as vscode from 'vscode';

export class RegisterCommands
{
    /**
     * Register all needed commands for this extensions
     */
    public constructor()
    {
        vscode.commands.registerCommand("solutionExtension.gotoRange", (args: vscode.Range) =>
        {
            vscode.window.activeTextEditor?.revealRange(args, vscode.TextEditorRevealType.InCenter);
        });
    
        vscode.commands.registerCommand("solutionExtension.openFile", (args: vscode.Uri) =>
        {
            const options: vscode.TextDocumentShowOptions =
            {
                preview: true,
            }
    
            vscode.window.showTextDocument(args, options);
        });
    
        vscode.commands.registerCommand("solutionExtension.openFolder", (args: vscode.Uri) =>
        {
            vscode.commands.executeCommand("vscode.openFolder", args, true)
        });
    }
}