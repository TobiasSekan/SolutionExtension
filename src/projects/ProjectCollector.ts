import * as vscode from 'vscode';
import { Project } from './Project';

export class ProjectCollector
{
    /**
     * List with all projects that are described inside the solution
     */
    public ProjectList: Array<Project>;

    public constructor(textDocument: vscode.TextDocument, collectNestedProjects: boolean)
    {
        this.ProjectList = new Array<Project>();

        this.CollectAllProjectGuid(textDocument);

        if(collectNestedProjects)
        {
            this.CollectAllNestedProjects(textDocument);
        }
    }

    /**
     * Collect all information from the project lines 
     * @param textDocument The text document of the complete solution file
     */
    public CollectAllProjectGuid(textDocument: vscode.TextDocument): void
    {
        for(let lineNumber = 0; lineNumber < textDocument.lineCount; lineNumber++)
        {
            const textLine = textDocument.lineAt(lineNumber);
            const lineText = textLine.text.trim();
            const lowerCase = lineText.toLowerCase();

            if(!lowerCase.startsWith("project("))
            {
                continue;
            }

            if(lineText.split("\"").length < 8)
            {
                continue;
            }

            this.ProjectList.push(new Project(textDocument, textLine));
        }
    }

    /**
     * Collect all information about nested projects
     * @param textDocument The text document of the complete solution file
     */
    public CollectAllNestedProjects(textDocument: vscode.TextDocument): void
    {
        let insideNestedProjects = false;

        for(let lineNumber = 0; lineNumber < textDocument.lineCount; lineNumber++)
        {
            const textLine = textDocument.lineAt(lineNumber);
            const lowerCase = textLine.text.trim().toLowerCase();

            if(lowerCase.indexOf("globalsection(nestedprojects)") > -1)
            {
                insideNestedProjects = true;
                continue;
            }

            if(lowerCase.indexOf("endglobalsection") > -1)
            {
                insideNestedProjects = false;
                continue;
            }

            if(!insideNestedProjects)
            {
                continue;
            }

            let guidStart = textLine.text.indexOf("{",) + 1;
            let guidEnd = textLine.text.indexOf("}", guidStart);

            if(guidStart === -1 || guidEnd === -1)
            {
                return;
            }

            
            let projectGuid = textLine.text.substr(guidStart, guidEnd - guidStart);
            
            const project = this.ProjectList.find(found => found.Guid == projectGuid);
            if(!project)
            {
                return;
            }

            guidStart = textLine.text.indexOf("{", guidEnd) + 1;
            guidEnd = textLine.text.indexOf("}", guidStart);

            projectGuid = textLine.text.substr(guidStart, guidEnd - guidStart);
            project.NestedInProjects.push([textLine, projectGuid]);
        }
    }
}