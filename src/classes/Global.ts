import * as vscode from 'vscode';
import { GlobalSection } from "./GlobalSection";
import { SolutionModule } from "./SolutionModule";

/**
 * A global module inside a solution
 */
export class Global extends SolutionModule
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

        super("Global", start, end);

        this.GlobalSections = new Array<GlobalSection>();

        let startLine = start;
        let endLine = start;

        for(let lineNumber = start.line; lineNumber < end.line; lineNumber++)
        {
            const textLine = textDocument.lineAt(lineNumber);
            const lineText = textLine.text.trim();
            const lowerCase = lineText.toLowerCase();
            
            if(lowerCase.startsWith("globalsection"))
            {
                startLine = textLine.range.start;
            }
            
            if(lowerCase === "endglobalsection")
            {
                endLine = textLine.range.end;
                this.GlobalSections.push(new GlobalSection(textDocument, startLine, endLine));
            }
        }
    }

    public GlobalSections: Array<GlobalSection>;
}