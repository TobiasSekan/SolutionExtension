import * as vscode from 'vscode';
import { HoverProvider } from './Provider/Hover';
import { CodelensProvider } from './Provider/Codelens';
import { ModuleCompletionItemProvider } from './Completion/ModuleCompletionItemProvider';
import { ValueCompletionItemProvider } from './Completion/ValueCompletionItem';
import { PropertyCompletionItemProvider } from './Completion/PropertyCompletionItem';
import { DocumentSymbolProvider } from './Provider/DocumentSymbol';
import { DefinitionProvider } from './Provider/Definition';
import { DocumentHighlightProvider } from './Provider/DocumentHighlight';
import { ReferenceProvider } from './Provider/Reference';
import { ImplementationProvider } from './Provider/Implementation';
import { DocumentLinkProvider } from './Provider/DocumentLink';
import { SignatureHelpProvider } from './Provider/SignatureHelp';
import { WorkspaceSymbolProvider } from './Provider/WorkspaceSymbol';
import { ParenthesesCompletionItemProvider } from './Completion/ParenthesesCompletionItem';
import { SectionCompletionItemProvider } from './Completion/SectionCompletionItem';

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