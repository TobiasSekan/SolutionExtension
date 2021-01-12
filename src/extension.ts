'use strict';

import * as vscode from 'vscode';
import { guidDiagnostic } from './guidDiagnostic';
import { solutionHover } from './solutionHover';
import { codelensProvider } from './codelensProvider';
import { ModuleProvider } from './completion/moduleProvider';
import { ValueProvider } from './completion/valueProvider';
import { KeywordProvider } from './completion/keywordProvider';

export function activate(context: vscode.ExtensionContext): void
{
    const diagnostic = new guidDiagnostic(vscode.languages.createDiagnosticCollection('sln'));
    const hover = new solutionHover();
    const codelens = new codelensProvider();

    // Update diagnostic when a document is restored on startup
    if (vscode.window.activeTextEditor)
    {
        updateDiagnostics(diagnostic, vscode.window.activeTextEditor.document);
    }
    
    // Update diagnostic when a new document will open
    vscode.window.onDidChangeActiveTextEditor(
        onChangeActiveTextEditor(diagnostic),
        null,
        context.subscriptions);
        
    // Update diagnostic when a document was changed
    vscode.workspace.onDidChangeTextDocument(
        onChangeTextDocument(diagnostic),
        null,
        context.subscriptions);
            
    context.subscriptions.push(
        vscode.languages.registerHoverProvider("sln", hover));

    context.subscriptions.push(
        vscode.languages.registerCodeLensProvider("sln", codelens));

    context.subscriptions.push(
        vscode.languages.registerCompletionItemProvider("sln", new ModuleProvider()));

    context.subscriptions.push(
        vscode.languages.registerCompletionItemProvider("sln", new ValueProvider(), "("));

    context.subscriptions.push(
        vscode.languages.registerCompletionItemProvider("sln", new KeywordProvider(), "="));
}

function onChangeTextDocument(diagnostic: guidDiagnostic): (e: vscode.TextDocumentChangeEvent) => any
{
    return textDocumentChangeEvent =>
    {
        if(!textDocumentChangeEvent)
        {
            return;
        }

        updateDiagnostics(diagnostic, textDocumentChangeEvent.document);
    }
}

function onChangeActiveTextEditor(diagnostic: guidDiagnostic): (e: vscode.TextEditor | undefined) => any
{
    return textEditor =>
    {
        if (!textEditor)
        {
            return;
        }

        updateDiagnostics(diagnostic, textEditor.document);
    };
}

function updateDiagnostics(diagnostic: guidDiagnostic, textDocument: vscode.TextDocument): void
{
    if(!textDocument || textDocument.languageId !== "sln")
    {
        return;
    }

    diagnostic.updateDiagnostics(textDocument);
}
