import * as vscode from 'vscode';
import { Project } from './projects/Project';

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

        for(let lineNumber = 0; lineNumber < document.lineCount; lineNumber++)
        {
            const line = document.lineAt(lineNumber)
            const lineText = line.text.trim();

            if(!lineText.startsWith("Project("))
            {
                continue;
            }

            if(lineText.split("\"").length < 8)
            {
                continue;
            }

            guidList.push(new Project(line));
        }

        return guidList;
    }
}