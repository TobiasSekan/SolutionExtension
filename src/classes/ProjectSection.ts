import * as vscode from 'vscode';
import { SolutionModule } from "./SolutionModule";

/**
 * A global section module inside of a global module
 */
export class ProjectSection extends SolutionModule
{
    public constructor(
        textDocument: vscode.TextDocument,
        start: vscode.Position|undefined,
        end: vscode.Position|undefined)
    {
        if(!start)
        {
            start = textDocument.lineAt(0).range.start;
        }

        if(!end)
        {
            end = textDocument.lineAt(textDocument.lineCount).range.end;
        }

        const textLine = textDocument.lineAt(start.line)

        const type = textLine.text.substring(
            textLine.text.indexOf("(") + 1,
            textLine.text.indexOf(")"));
 
        super(type, start, end);

        this.KeyValueList = new Array<[vscode.TextLine, string, string]>();

        for (let lineNumber = start.line + 1; lineNumber < end.line; lineNumber++)
        {
            const line = textDocument.lineAt(lineNumber);
            const lineSplit = line.text.split('=');

            if(lineSplit.length < 2)
            {
                continue;
            }

            const left = lineSplit[0].trim().replace('{', '').replace('}', '').trim();
            const right = lineSplit[1].trim().replace('{', '').replace('}', '').trim();

            this.KeyValueList.push([line, left, right])
        }
    }

    public KeyValueList: Array<[vscode.TextLine, string, string]>
}