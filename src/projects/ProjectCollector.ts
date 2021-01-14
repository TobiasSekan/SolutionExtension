import * as vscode from 'vscode';
import { Project } from './Project';

export class ProjectCollector
{
    public constructor()
    {
    }

    /**
     * Collect all information from the project lines 
     * @param textDocument The text document of the complete solution file
     */
    public CollectAllProjectGuid(textDocument: vscode.TextDocument): Array<Project>
    {
        const projectList = new Array<Project>();

        for(let lineNumber = 0; lineNumber < textDocument.lineCount; lineNumber++)
        {
            const line = textDocument.lineAt(lineNumber)
            const lineText = line.text.trim();

            if(!lineText.toLowerCase().startsWith("project("))
            {
                continue;
            }

            if(lineText.split("\"").length < 8)
            {
                continue;
            }

            projectList.push(new Project(textDocument, line));
        }

        return projectList;
    }
}