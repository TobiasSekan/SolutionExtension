import * as vscode from 'vscode';

export class VscodeHelper
{
    /**
     * Return a range for the given character range
     * @param line The line that contains the line number for the range
     * @param characterStart The first character of the range
     * @param characterEnd The last character of the range
     */
    public static GetRange(line: vscode.TextLine, characterStart: number, characterEnd: number): vscode.Range
    {
        const start = new vscode.Position(line.lineNumber, characterStart);
        const end = new vscode.Position(line.lineNumber, characterEnd);

        return new vscode.Range(start, end);
    }
}