import * as vscode from 'vscode';
import { VscodeHelper } from '../helper/vscodeHelper';

export class ReferenceProvider implements vscode.ReferenceProvider
{
    provideReferences(document: vscode.TextDocument, position: vscode.Position, context: vscode.ReferenceContext, token: vscode.CancellationToken): vscode.ProviderResult<vscode.Location[]>
    {
        return new Promise<vscode.Location[]>((resolve, _) =>
        {
            const list = new Array<vscode.Location>();

            const guid = VscodeHelper.GetGuidFromPosition(document, position);
            if(guid)
            {
                for(let lineNumber = 0; lineNumber < document.lineCount; lineNumber++)
                {
                    const textLine = document.lineAt(lineNumber);
                    const uppercase = textLine.text.toUpperCase();

                    if(uppercase.indexOf(guid) < 0)
                    {
                        continue;
                    }

                    const range = VscodeHelper.GetRange(textLine, guid, guid);
                    const lastRange = VscodeHelper.GetLastRange(textLine, guid, guid);

                    list.push(new vscode.Location(document.uri, range));

                    if(lastRange.start.compareTo(range.start) == 0)
                    {
                        continue;
                    }

                    list.push(new vscode.Location(document.uri, lastRange));
                }
            }

            resolve(list);
        });
    }
}