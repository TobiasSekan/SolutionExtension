import * as vscode from 'vscode';
import { Diagnostic } from './Diagnostic';
import { HoverProvider } from './provider/Hover';
import { CodelensProvider } from './provider/Codelens';
import { ModuleProvider } from './completion/ModuleProvider';
import { ValueProvider } from './completion/ValueProvider';
import { PropertyProvider } from './completion/PropertyProvider';
import { KeywordProvider } from './completion/KeywordProvider';
import { ReferenceProvider } from './completion/ReferenceProvider';
import { TypeProvider } from './completion/TypeProvider';
import { DocumentSymbolProvider } from './provider/DocumentSymbol';
import { DefinitionProvider } from './provider/Definition';

const languageId = 'sln';

export function activate(context: vscode.ExtensionContext): void
{
    const diagnostic = new Diagnostic(vscode.languages.createDiagnosticCollection(languageId));

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

    const provider =
    [
        vscode.languages.registerCodeLensProvider(languageId, new CodelensProvider()),
        vscode.languages.registerCompletionItemProvider(languageId, new ModuleProvider()),
        vscode.languages.registerCompletionItemProvider(languageId, new PropertyProvider()),
        vscode.languages.registerCompletionItemProvider(languageId, new ValueProvider(), "="),
        vscode.languages.registerCompletionItemProvider(languageId, new KeywordProvider(), "("),
        vscode.languages.registerCompletionItemProvider(languageId, new ReferenceProvider(), "{"),
        vscode.languages.registerCompletionItemProvider(languageId, new TypeProvider(), "\""),
        vscode.languages.registerDocumentSymbolProvider(languageId, new DocumentSymbolProvider()),
        vscode.languages.registerDefinitionProvider(languageId, new DefinitionProvider()),
        vscode.languages.registerHoverProvider(languageId, new HoverProvider()),
    ];

    context.subscriptions.push(...provider);

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

        vscode.window.showTextDocument(args, options,);
    });

    vscode.commands.registerCommand("solutionExtension.openFolder", (args: vscode.Uri) =>
    {
        vscode.commands.executeCommand("vscode.openFolder", args, true)
    });
}

function onChangeTextDocument(diagnostic: Diagnostic): (e: vscode.TextDocumentChangeEvent) => any
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

function onChangeActiveTextEditor(diagnostic: Diagnostic): (e: vscode.TextEditor | undefined) => any
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

function updateDiagnostics(diagnostic: Diagnostic, textDocument: vscode.TextDocument): void
{
    if(!textDocument || textDocument.languageId !== languageId)
    {
        return;
    }

    diagnostic.UpdateDiagnostics(textDocument);
}
