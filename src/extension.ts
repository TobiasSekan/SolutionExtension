import * as vscode from 'vscode';
import { RegisterCommands } from './RegisterCommands';
import { RegisterEvents } from './RegisterEvents';
import { RegisterProvider } from './RegisterProvider';

export function activate(context: vscode.ExtensionContext): void
{
    const languageId = "sln";

    new RegisterCommands();
    new RegisterProvider(languageId, context.subscriptions);

    const events = new RegisterEvents(languageId, context.subscriptions);

    // Update diagnostic when a document is restored on startup
    if(vscode.window.activeTextEditor)
    {
        events.UpdateDiagnostics(vscode.window.activeTextEditor.document);
    }
}
