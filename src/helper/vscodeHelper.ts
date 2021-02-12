import * as vscode from 'vscode';
import * as path from 'path';

export class VscodeHelper
{
    /**
     * Return a range for the given word
     * @param line The line that contains the word
     * @param searchFor Search the first occur of the given word
     * @param word The word for the word length
     * @param relativePosition (optional) The relative position of the first found word character
     */
    public static GetRange(
        line: vscode.TextLine,
        searchFor: string,
        word: string,
        relativePosition: number = 0): vscode.Range
    {
        const characterStart = line.text.toUpperCase().indexOf(searchFor.toUpperCase()) + relativePosition;
        if(characterStart === -1)
        {
            return line.range;
        }

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
     * @param relativePosition (optional) The relative position of the last found word character
     */
    public static GetLastRange(
        line: vscode.TextLine,
        searchFor: string,
        word: string,
        relativePosition: number = 0): vscode.Range
    {
        const characterStart = line.text.toUpperCase().lastIndexOf(searchFor.toUpperCase()) + relativePosition;
        if(characterStart === -1)
        {
            return line.range;
        }

        const characterEnd = characterStart + word.length;

        const start = new vscode.Position(line.lineNumber, characterStart);
        const end = new vscode.Position(line.lineNumber, characterEnd);

        return new vscode.Range(start, end);
    }

    /**
     * Return the GUID of the current position, when possible
     * @param document The complete document
     * @param position The current position in the document
     */
    public static GetGuidFromPosition(document: vscode.TextDocument, position: vscode.Position): string|undefined
    {
        const currentLine = document.lineAt(position.line);

        let guidStart = -1;

        for(let index = position.character; index > 0; index--)
        {
            if(currentLine.text[index] === '{')
            {
                guidStart = index;
                break;
            }
        }

        const guidEnd = currentLine.text.indexOf('}', position.character);

        if(guidEnd - guidStart > 40)
        {
            return undefined;
        }

        return currentLine.text.substring(guidStart + 1, guidEnd).toUpperCase();
    }

    /**
     * Return the absolute path of the given file
     * @param textDocument A root document that contains the root folder path
     * @param filePath The (relative) file path
     */
    public static GetAbsoluteFilePath(textDocument: vscode.TextDocument, filePath: string): string
    {
        if(path.isAbsolute(filePath))
        {
            return filePath;
        }
        else
        {
            const dir = path.dirname(textDocument.fileName);
            return  path.join(dir, filePath);
        }
    }

    /**
     * Return a empty range (use this for not found elements)
     */
    public static GetEmptyRange(): vscode.Range
    {
        return new vscode.Range(0, 0, 0, 0);
    }
}