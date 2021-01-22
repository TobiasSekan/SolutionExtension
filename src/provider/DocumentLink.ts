import * as vscode from 'vscode';
import * as fs from 'fs';
import { ProjectCollector } from '../projects/ProjectCollector';
import { VscodeHelper } from '../helper/vscodeHelper';

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
                if(!project.IsSolutionFolder())
                {
                    try
                    {
                        fs.accessSync(project.AbsolutePath, fs.constants.R_OK);
                        const uri = vscode.Uri.file(project.AbsolutePath);
                        list.push(new vscode.DocumentLink(project.GetPathRange(), uri));
                    }
                    catch
                    {
                    }
                }

                for(const section of project.ProjectSections)
                {
                    if(section.Type.toLowerCase() === "projectdependencies")
                    {
                        continue;
                    }

                    for(const [line, _, filePath] of section.KeyValueList)
                    {
                        const path = VscodeHelper.GetAbsoluteFilePath(document, filePath);

                        try
                        {
                            fs.accessSync(path, fs.constants.R_OK);

                            const uri = vscode.Uri.file(path);
                            const range = VscodeHelper.GetLastRange(line, filePath, filePath);

                            list.push(new vscode.DocumentLink(range, uri));
                        }
                        catch
                        {
                        }
                    }
                }
            }

            resolve(list);
        });
    }
}