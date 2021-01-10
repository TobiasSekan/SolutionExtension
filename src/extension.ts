'use strict';
import * as vscode from 'vscode';
import { guidDiagnostic } from './guidDiagnostic';
import { solutionHover } from './solutionHover';
import { codelensProvider } from './codelensProvider';

let disposables: vscode.Disposable[] = [];

export function activate(context: vscode.ExtensionContext): void
{
    const collection = vscode.languages.createDiagnosticCollection('sln');
    const diagnostic = new guidDiagnostic(collection);
    const hover = new solutionHover();
    const codelens = new codelensProvider();

    // Update diagnostic when a document is restored on startup
    if (vscode.window.activeTextEditor)
    {
        diagnostic.updateDiagnostics(vscode.window.activeTextEditor.document);
    }

    context.subscriptions.push(
        vscode.languages.registerHoverProvider("sln", hover));

    // Update diagnostic when a new document will open
    context.subscriptions.push(
        vscode.window.onDidChangeActiveTextEditor(onChangeActiveTextEditor(diagnostic)));

    // Update diagnostic when a document was changed
    vscode.workspace.onDidChangeTextDocument(
        onChangeTextDocument(diagnostic),
        null,
        context.subscriptions)

    vscode.languages.registerCodeLensProvider("*", codelens);

    vscode.commands.registerCommand("codelens.enableCodeLens", () => {
        vscode.workspace.getConfiguration("codelens").update("enableCodeLens", true, true);
    });

    vscode.commands.registerCommand("codelens.disableCodeLens", () => {
        vscode.workspace.getConfiguration("codelens").update("enableCodeLens", false, true);
    });

    vscode.commands.registerCommand("codelens.codelensAction", (args: any) => {
        vscode.window.showInformationMessage(`CodeLens action clicked with args=${args}`);
    });
}

function onChangeTextDocument(diagnostic: guidDiagnostic): (e: vscode.TextDocumentChangeEvent) => any
{
    return textDocumentChangeEvent =>
    {
        if(textDocumentChangeEvent)
        {
            const textDocument = textDocumentChangeEvent.document;
            if(textDocument && textDocument.languageId == "sln")
            {
                diagnostic.updateDiagnostics(textDocument);
            }
        }
    }
}

function onChangeActiveTextEditor(diagnostic: guidDiagnostic): (e: vscode.TextEditor | undefined) => any
{
    return textEditor =>
    {
        if (textEditor)
        {
            diagnostic.updateDiagnostics(textEditor.document);
        }
    };
}

// this method is called when your extension is deactivated
export function deactivate()
{
    if (disposables)
    {
        disposables.forEach(item => item.dispose());
    }

    disposables = [];
}
