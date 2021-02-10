import * as vscode from 'vscode';
import { VscodeHelper } from '../Helper/vscodeHelper';

export class  DefinitionProvider implements vscode.DefinitionProvider
{
    provideDefinition(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken): vscode.ProviderResult<vscode.Location | vscode.Location[] | vscode.LocationLink[]>
    {
        return new Promise<vscode.Location | vscode.Location[] | vscode.LocationLink[]>((resolve, _) =>
        {
            const list = new Array<vscode.Location>();
            const textLine = document.lineAt(position);

            const uppercase = textLine.text.toUpperCase();
            if(uppercase.toLowerCase().startsWith("project("))
            {
                resolve(list);
            }

            const guid = VscodeHelper.GetGuidFromPosition(document, position);
            if(guid)
            {

                for(let lineNumber = 0; lineNumber < document.lineCount; lineNumber++)
                {
                    if(lineNumber === position.line)
                    {
                        continue;
                    }

                    const textLine = document.lineAt(lineNumber);
                    const uppercase = textLine.text.toUpperCase();

                    if(!uppercase.toLowerCase().startsWith("project("))
                    {
                        continue;
                    }

                    if(uppercase.indexOf(guid) < 0)
                    {
                        continue;
                    }

                    const lastRange = VscodeHelper.GetLastRange(textLine, guid, guid);

                    list.push(new vscode.Location(document.uri, lastRange));
                }
            }

            resolve(list);
        });
    }
}