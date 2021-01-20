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
    private CollectAllProjectGuid(textDocument: vscode.TextDocument): void
    {
        let isInProject = false;
        let isInSolutionItem = false;
        let project: Project|undefined;

        for(let lineNumber = 0; lineNumber < textDocument.lineCount; lineNumber++)
        {

            const textLine = textDocument.lineAt(lineNumber);
            const lineText = textLine.text.trim();
            const lowerCase = lineText.toLowerCase();

            if(lowerCase.startsWith("endproject"))
            {
                if(project)
                {
                    this.ProjectList.push(project);
                }

                isInProject = false;
                isInSolutionItem = false;
                project = undefined;
                continue;
            }

            if(isInProject && lowerCase.startsWith("endprojectsection"))
            {
                isInSolutionItem = false;
                continue;
            }

            if(isInSolutionItem && project)
            {
                project.SolutionItems.push(textLine);
            }

            if(lowerCase.startsWith("projectsection(solutionitems)"))
            {
                isInSolutionItem = true;
                continue;
            }

            if(lowerCase.startsWith("project("))
            {
                isInProject = true;
                
                if(lineText.split("\"").length < 8)
                {
                    continue;
                }

                project = new Project(textDocument, textLine)
            }
        }
    }

    /**
     * Collect all information about nested projects
     * @param textDocument The text document of the complete solution file
     */
    private CollectAllNestedProjects(textDocument: vscode.TextDocument): void
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