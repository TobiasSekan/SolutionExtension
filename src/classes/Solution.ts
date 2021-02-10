import * as vscode from 'vscode';
import { ProjectCollector } from '../Projects/ProjectCollector';
import { Global } from './Global';
import { Project } from './Project';

export class Solution
{
    /**
     * Create a new instance of GlobalSection
     * @param startLine The first line of this module
     */
    constructor(textDocument: vscode.TextDocument, nestedProjects: boolean = false)
    {
        // TODO:
        this.Projects = new ProjectCollector(textDocument, nestedProjects).ProjectList;

        let start: vscode.Position|undefined;
        let end: vscode.Position|undefined;

        for(let lineNumber = 0; lineNumber < textDocument.lineCount; lineNumber++)
        {
            const textLine = textDocument.lineAt(lineNumber);
            const lineText = textLine.text.trim();
            const lowerCase = lineText.toLowerCase();

            if(lowerCase === "global")
            {
                start = textLine.range.start;
            }
            
            if(lowerCase === "endglobal")
            {
                end = textLine.range.end;
            }
        }

        this.Global = new Global(textDocument, start, end);
    }

    public Projects: Array<Project>;

    public Global?: Global;
}