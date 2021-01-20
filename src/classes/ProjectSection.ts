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
    }
}