'use strict';

import * as vscode from 'vscode';
import { guidDiagnostic } from './guidDiagnostic';
import { solutionHover } from './solutionHover';
import { codelensProvider } from './codelensProvider';
import { ModuleProvider } from './completion/ModuleProvider';
import { ValueProvider } from './completion/ValueProvider';
import { PropertyProvider } from './completion/PropertyProvider';
import { KeywordProvider } from './completion/KeywordProvider';
import { ReferenceProvider } from './completion/ReferenceProvider';
import { TypeProvider } from './completion/TypeProvider';

const languageId = 'sln';

export function activate(context: vscode.ExtensionContext): void
{
    const diagnostic = new guidDiagnostic(vscode.languages.createDiagnosticCollection(languageId));
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
        vscode.languages.registerHoverProvider(languageId, hover));

    context.subscriptions.push(
        vscode.languages.registerCodeLensProvider(languageId, codelens));

    context.subscriptions.push(
        vscode.languages.registerCompletionItemProvider(languageId, new ModuleProvider()));

    context.subscriptions.push(
        vscode.languages.registerCompletionItemProvider(languageId, new PropertyProvider()));
    
    context.subscriptions.push(
        vscode.languages.registerCompletionItemProvider(languageId, new ValueProvider(), "="));

    context.subscriptions.push(
        vscode.languages.registerCompletionItemProvider(languageId, new KeywordProvider(), "("));

    context.subscriptions.push(
        vscode.languages.registerCompletionItemProvider(languageId, new ReferenceProvider(), "{"));

    context.subscriptions.push(
        vscode.languages.registerCompletionItemProvider(languageId, new TypeProvider(), "\""));
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
    if(!textDocument || textDocument.languageId !== languageId)
    {
        return;
    }

    diagnostic.updateDiagnostics(textDocument);
}
