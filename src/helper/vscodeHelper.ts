import * as vscode from 'vscode';

export class VscodeHelper
{
    /**
     * Return a range for the given word
     * @param line The line that contains the word
     * @param searchFor Search the first occur of the given word
     * @param word The word for the word length
     * @param relativePosition The relative position of the first found word character
     */
    public static GetRange(line: vscode.TextLine, searchFor: string, word: string, relativePosition: number = 0): vscode.Range
    {
        const characterStart = line.text.indexOf(searchFor) + relativePosition;
        const characterEnd = characterStart + word.length;

        const start = new vscode.Position(line.lineNumber, characterStart);
        const end = new vscode.Position(line.lineNumber, characterEnd);

        return new vscode.Range(start, end);
    }

    /**
     * Return the last range for the given word
     * @param line The line that contains the word
     * @param searchFor Search the last occur of the given word
     * @param word The word for the word length
     * @param relativePosition The relative position of the last found word character
     */
    public static GetLastRange(line: vscode.TextLine, searchFor: string, word: string, relativePosition: number = 0): vscode.Range
    {
        const characterStart = line.text.lastIndexOf(searchFor) + relativePosition;
        const characterEnd = characterStart + word.length;

        const start = new vscode.Position(line.lineNumber, characterStart);
        const end = new vscode.Position(line.lineNumber, characterEnd);

        return new vscode.Range(start, end);
    }
}