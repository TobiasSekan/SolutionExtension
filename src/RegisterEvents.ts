import * as vscode from 'vscode';
import { Diagnostic } from './Diagnostic';

export class RegisterEvents
{
    //#region Private Fields

    private languageId: string;

    private diagnostic: Diagnostic;

    //#endregion Private Fields

    //#region Public Constructors

    constructor(languageId: string, subscriptions: Array<vscode.Disposable>)
    {
        this.languageId = languageId;
        this.diagnostic = new Diagnostic(vscode.languages.createDiagnosticCollection(this.languageId));

        //vscode.window.onDidChangeActiveTerminal
        vscode.window.onDidChangeActiveTextEditor(this.OnChangeActiveTextEditor(), null, subscriptions);
        //vscode.window.onDidChangeTextEditorOptions
        //vscode.window.onDidChangeTextEditorSelection
        //vscode.window.onDidChangeTextEditorViewColumn
        //vscode.window.onDidChangeTextEditorVisibleRanges
        //vscode.window.onDidChangeVisibleTextEditors
        //vscode.window.onDidChangeWindowState
        //vscode.window.onDidCloseTerminal
        //vscode.window.onDidOpenTerminal

        //vscode.workspace.onDidChangeConfiguration
        vscode.workspace.onDidChangeTextDocument(this.OnChangeTextDocument(), null, subscriptions);
        //vscode.workspace.onDidChangeWorkspaceFolders
        vscode.workspace.onDidCloseTextDocument(this.OnDidCloseTextDocument(), null, subscriptions);
        vscode.workspace.onDidOpenTextDocument(this.OnDidOpenTextDocument(), null, subscriptions);
        //vscode.workspace.onDidSaveTextDocument
        //vscode.workspace.onWillSaveTextDocument
    }

    //#endregion Public Constructors

    //#region Public Methods

    /**
     * Update the complete diagnostic
     * @param textDocument The document for the diagnostic
     */
    public UpdateDiagnostics(textDocument: vscode.TextDocument|undefined): void
    {
        if(textDocument && textDocument.languageId === this.languageId)
        {
            this.diagnostic.UpdateDiagnostics(textDocument);
            return;
        }

        // workaround for SCM - see https://github.com/microsoft/vscode/issues/120537
        if(textDocument
        && textDocument.languageId === 'plaintext'
        && textDocument.uri.fsPath.endsWith(`${this.languageId}.git`))
        {
            this.diagnostic.UpdateDiagnostics(textDocument);
            return;
        }

        this.diagnostic.ClearDiagnostic();
    }

    //#endregion Public Methods

    //#region Private Methods

    /**
     * Function is called when the text document has changed
     */
    private OnChangeTextDocument(): (e: vscode.TextDocumentChangeEvent) => any
    {
        return textDocumentChangeEvent =>
        {
            if(!textDocumentChangeEvent)
            {
                return;
            }

            this.UpdateDiagnostics(textDocumentChangeEvent.document);
        }
    }

    /**
     * Function is called when the active text editor has changed
     */
    private OnChangeActiveTextEditor(): (e: vscode.TextEditor | undefined) => any
    {
        return textEditor =>
        {
            if (!textEditor)
            {
                return;
            }

            this.UpdateDiagnostics(textEditor.document);
        };
    }

    /**
     * Function is called when the text document was closed
     */
    private OnDidCloseTextDocument(): (e: vscode.TextDocument | undefined) => any
    {
        return _ =>
        {
            this.diagnostic.ClearDiagnostic();
        }
    }

    /**
     * Function is called when a text document has opened (inclusive language change)
     */
    private OnDidOpenTextDocument(): (e: vscode.TextDocument | undefined) => any
    {
        return textDocument =>
        {
            this.UpdateDiagnostics(textDocument);
        }
    }

    //#endregion Private Methods
}