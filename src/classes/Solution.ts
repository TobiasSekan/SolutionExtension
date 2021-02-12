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

            if(start === undefined)
            {
                if(this.FileFormat === undefined
                && lowerCase.startsWith("microsoft visual studio solution file, format version"))
                {
                    this.FileFormat = textLine;
                }

                if(this.VersionComment === undefined
                && lowerCase.startsWith("# visual studio version"))
                {
                    this.VersionComment = textLine;
                }

                if(this.StudioVersion === undefined
                && lowerCase.startsWith("visualstudioversion"))
                {
                    this.StudioVersion = textLine;
                }

                if(this.MinimumStudioVersion === undefined
                && lowerCase.startsWith("minimumvisualstudioversion"))
                {
                    this.MinimumStudioVersion = textLine;
                }
            }

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

    public FileFormat: vscode.TextLine|undefined;

    public VersionComment: vscode.TextLine|undefined;

    public StudioVersion: vscode.TextLine|undefined;

    public MinimumStudioVersion: vscode.TextLine|undefined;
}