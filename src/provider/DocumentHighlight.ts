import * as vscode from 'vscode';
import { VscodeHelper } from '../helper/vscodeHelper';

export class DocumentHighlightProvider implements vscode.DocumentHighlightProvider
{
    provideDocumentHighlights(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken): vscode.ProviderResult<vscode.DocumentHighlight[]>
    {
        return new Promise<vscode.DocumentHighlight[]>((resolve, reject) =>
        {
            const guid = VscodeHelper.GetGuidFromPosition(document, position);
            if(guid)
            {
                const list = new Array<vscode.DocumentHighlight>();

                for(let lineNumber = 0; lineNumber < document.lineCount; lineNumber++)
                {
                    const textLine = document.lineAt(lineNumber);
                    if(textLine.text.indexOf(guid) < 0)
                    {
                        continue;
                    }

                    const range = VscodeHelper.GetRange(textLine, guid, guid);
                    const lastRange = VscodeHelper.GetLastRange(textLine, guid, guid);

                    list.push(new vscode.DocumentHighlight(range));
                    if(lastRange.start.compareTo(range.start) == 0)
                    {
                        continue;
                    }

                    list.push(new vscode.DocumentHighlight(lastRange));
                }

                resolve(list);
            }

            reject();
        });
    }
}