import * as vscode from 'vscode';
import * as fs from 'fs';
import { ProjectCollector } from '../projects/ProjectCollector';

export class DocumentLinkProvider implements vscode.DocumentLinkProvider
{
    provideDocumentLinks(document: vscode.TextDocument, token: vscode.CancellationToken): vscode.ProviderResult<vscode.DocumentLink[]>
    {
        return new Promise<vscode.DocumentLink[]>((resolve, _) =>
        {
            const list = new Array<vscode.DocumentLink>();

            const projectList = new ProjectCollector(document, false).ProjectList;
            for(const project of projectList)
            {
                if(project.IsSolutionFolder())
                {
                    continue;
                }

                try
                {
                    fs.accessSync(project.AbsolutePath, fs.constants.R_OK)
                    const uri = vscode.Uri.file(project.AbsolutePath);
                    list.push(new vscode.DocumentLink(project.GetPathRange(), uri));
                }
                catch
                {
                }
            }

            resolve(list);
        });
    }
}