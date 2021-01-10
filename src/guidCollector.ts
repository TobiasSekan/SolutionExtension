import * as vscode from 'vscode';

export class guidCollector
{
    public constructor()
    {
    }

    /**
     * Collect all use guid in the solution file
     * @param document The Textdocument of the complete solution file
     */
    public CollectAllProjectGuid(document: vscode.TextDocument): Array<string>
    {
        const guidList = new Array<string>();

        for (let line = 0; line < document.lineCount; line++)
        {
            const lineText = document.lineAt(line).text.trim();

            if (!lineText.startsWith("Project("))
            {
                continue;
            }

            const lineSplit = lineText.split("\"");

            const guid = lineSplit[lineSplit.length - 2].replace("{", "").replace("}", "");

            guidList.push(guid);
        }

        return guidList;
    }
}