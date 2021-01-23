import * as vscode from 'vscode';
import { Diagnostic } from './Diagnostic';
import { HoverProvider } from './provider/Hover';
import { CodelensProvider } from './provider/Codelens';
import { ModuleProvider } from './completion/ModuleProvider';
import { ValueProvider } from './completion/ValueProvider';
import { PropertyProvider } from './completion/PropertyProvider';
import { CompletionReferenceProvider } from './completion/ReferenceProvider';
import { DocumentSymbolProvider } from './provider/DocumentSymbol';
import { DefinitionProvider } from './provider/Definition';
import { DocumentHighlightProvider } from './provider/DocumentHighlight';
import { ReferenceProvider } from './provider/Reference';
import { ImplementationProvider } from './provider/Implementation';
import { DocumentLinkProvider } from './provider/DocumentLink';
import { SignatureHelpProvider } from './provider/SignatureHelp';
import { WorkspaceSymbolProvider } from './provider/WorkspaceSymbol';
import { ParenthesesCompletionItemProvider } from './completion/Parentheses';

const languageId = "sln";

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

    vscode.workspace.onDidCloseTextDocument(
        onDidCloseTextDocument(diagnostic),
        null,
        context.subscriptions)

    //  https://code.visualstudio.com/api/language-extensions/programmatic-language-features

    const provider =
    [
        //vscode.languages.registerCodeActionsProvider
        vscode.languages.registerCodeLensProvider(languageId, new CodelensProvider()),
        //vscode.languages.registerColorProvider
        vscode.languages.registerCompletionItemProvider(languageId, new ModuleProvider()),
        vscode.languages.registerCompletionItemProvider(languageId, new PropertyProvider()),
        vscode.languages.registerCompletionItemProvider(languageId, new ValueProvider(), "="),
        vscode.languages.registerCompletionItemProvider(languageId, new ParenthesesCompletionItemProvider(), "("),
        vscode.languages.registerCompletionItemProvider(languageId, new CompletionReferenceProvider(), "{"),
        //vscode.languages.registerDeclarationProvider
        vscode.languages.registerDefinitionProvider(languageId, new DefinitionProvider()),
        //vscode.languages.registerDocumentFormattingEditProvider
        vscode.languages.registerDocumentHighlightProvider(languageId, new DocumentHighlightProvider()),
        vscode.languages.registerDocumentLinkProvider(languageId, new DocumentLinkProvider()),
        //vscode.languages.registerDocumentRangeFormattingEditProvider
        vscode.languages.registerDocumentSymbolProvider(languageId, new DocumentSymbolProvider()),
        //vscode.languages.registerFoldingRangeProvider
        vscode.languages.registerHoverProvider(languageId, new HoverProvider()),
        vscode.languages.registerImplementationProvider(languageId, new ImplementationProvider()),
        //vscode.languages.registerOnTypeFormattingEditProvider
        vscode.languages.registerReferenceProvider(languageId, new ReferenceProvider()),
        //vscode.languages.registerRenameProvider
        //vscode.languages.registerSelectionRangeProvider
        vscode.languages.registerSignatureHelpProvider(languageId, new SignatureHelpProvider(), "("),
        //vscode.languages.registerTypeDefinitionProvider
        vscode.languages.registerWorkspaceSymbolProvider(new WorkspaceSymbolProvider()),
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

        vscode.window.showTextDocument(args, options);
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

function onDidCloseTextDocument(diagnostic: Diagnostic): (e: vscode.TextDocument | undefined) => any
{
    return textDocument =>
    {
        diagnostic.ClearDiagnostic();
        return;
    }
}

function updateDiagnostics(diagnostic: Diagnostic, textDocument: vscode.TextDocument): void
{
    if(!textDocument || textDocument.languageId !== languageId)
    {
        return;
    }

    diagnostic.UpdateDiagnostics(textDocument);
}
