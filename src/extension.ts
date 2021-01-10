'use strict';
import * as vscode from 'vscode';
import { guidDiagnostic } from './guidDiagnostic';
import { solutionHover } from './solutionHover';

export function activate(context: vscode.ExtensionContext): void
{
    const collection = vscode.languages.createDiagnosticCollection('sln');
    const diagnostic = new guidDiagnostic(collection);
    const hover = new solutionHover();

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


