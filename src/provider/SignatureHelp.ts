import * as vscode from 'vscode';

export class SignatureHelpProvider implements vscode.SignatureHelpProvider
{
    provideSignatureHelp(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken, context: vscode.SignatureHelpContext): vscode.ProviderResult<vscode.SignatureHelp>
    {
        return new Promise<vscode.SignatureHelp>((resolve, rejects) =>
        {
            let signatureInformation: vscode.SignatureInformation|undefined;

            const word = document.lineAt(position).text.trimLeft().toLowerCase();
            
            if(word.startsWith("projectsection"))
            {
                signatureInformation = new vscode.SignatureInformation(
                    "ProjectSection(section)")
            }
            else if(word.startsWith("globalsection"))
            {
                signatureInformation = new vscode.SignatureInformation(
                    "GlobalSection(section)")
            }
            else if(word.startsWith("project"))
            {
                signatureInformation = new vscode.SignatureInformation(
                    "Project(string type, string name, string path, string identifier)")
            }
            else
            {
                rejects();
            }

            if(signatureInformation)
            {
                const signatureHelp = new vscode.SignatureHelp();
                signatureHelp.signatures = [ signatureInformation ];
                resolve(signatureHelp)
            }
            else
            {
                rejects();
            }
        });
    }
}