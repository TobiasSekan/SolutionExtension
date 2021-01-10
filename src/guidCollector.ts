import * as vscode from 'vscode';
import { Project } from './Project';

export class guidCollector
{
    public constructor()
    {
    }

    /**
     * Collect all use guid in the solution file
     * @param document The Textdocument of the complete solution file
     */
    public CollectAllProjectGuid(document: vscode.TextDocument): Array<Project>
    {
        const guidList = new Array<Project>();

        for (let line = 0; line < document.lineCount; line++)
        {
            const lineText = document.lineAt(line).text.trim();

            if (!lineText.startsWith("Project("))
            {
                continue;
            }

            guidList.push(new Project(lineText));
        }

        return guidList;
    }
}