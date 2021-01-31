import * as vscode from 'vscode';
import { HoverProvider } from './provider/Hover';
import { CodelensProvider } from './provider/Codelens';
import { ModuleCompletionItemProvider } from './completion/ModuleCompletionItemProvider';
import { ValueCompletionItemProvider } from './completion/ValueCompletionItem';
import { PropertyCompletionItemProvider } from './completion/PropertyCompletionItem';
import { DocumentSymbolProvider } from './provider/DocumentSymbol';
import { DefinitionProvider } from './provider/Definition';
import { DocumentHighlightProvider } from './provider/DocumentHighlight';
import { ReferenceProvider } from './provider/Reference';
import { ImplementationProvider } from './provider/Implementation';
import { DocumentLinkProvider } from './provider/DocumentLink';
import { SignatureHelpProvider } from './provider/SignatureHelp';
import { WorkspaceSymbolProvider } from './provider/WorkspaceSymbol';
import { ParenthesesCompletionItemProvider } from './completion/ParenthesesCompletionItem';
import { SectionCompletionItemProvider } from './completion/SectionCompletionItem';

export class RegisterProvider
{
    /**
     * Register all needed provider for this extensions
     */
    public constructor(languageId: string, subscriptions: Array<vscode.Disposable>)
    {
        //  https://code.visualstudio.com/api/language-extensions/programmatic-language-features

        const provider =
        [
            //vscode.languages.registerCodeActionsProvider
            vscode.languages.registerCodeLensProvider(languageId, new CodelensProvider()),
            //vscode.languages.registerColorProvider
            vscode.languages.registerCompletionItemProvider(languageId, new ModuleCompletionItemProvider()),
            vscode.languages.registerCompletionItemProvider(languageId, new ParenthesesCompletionItemProvider(), "("),
            vscode.languages.registerCompletionItemProvider(languageId, new PropertyCompletionItemProvider()),
            vscode.languages.registerCompletionItemProvider(languageId, new SectionCompletionItemProvider(), "{"),
            vscode.languages.registerCompletionItemProvider(languageId, new ValueCompletionItemProvider(), "="),
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

        subscriptions.push(...provider);
    }
}