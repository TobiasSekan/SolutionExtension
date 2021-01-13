import * as vscode from 'vscode';
import * as path from 'path';
import { ProjectTypes } from "./ProjectTypes";

/**
 * A project inside a solution.
 */
export class Project
{
    /**
     * Crate a new project, based on the given (raw) project line string.
     * @param line The line that contains the project information.
     */
    public constructor(textDocument: vscode.TextDocument, line: vscode.TextLine)
    {
        const dir = path.dirname(textDocument.fileName)

        this.line = line;

        const lineSplit = line.text.trim().split("\"");

        this.typeGuid = lineSplit[1].replace("{", "").replace("}", "");;
        this.name = lineSplit[3];
        this.relativePath = lineSplit[5];
        this.guid = lineSplit[7].replace("{", "").replace("}", "");

        if(this.relativePath.indexOf(":") > -1)
        {
            this.absolutePath = this.relativePath;
        }
        else
        {
            this.absolutePath = dir + "\\" + this.relativePath;

        }

    }

    /** 
     * The text line that contains the project information.
     */
    public line: vscode.TextLine;

    /**
     * The project type (GUID).
     */
    public typeGuid: string;

    /**
     * The name of the project.
     */
    public name: string;

    /**
     * The relative path to the project.
     */
    public relativePath: string;

    /**
     * The relative path to the project.
     */
    public absolutePath: string;

    /**
     * The GUID of the project that is used in another places inside the solution.
     */
    public guid: string;

    /**
     * Return the project type name of this project.
     */
    public getProjectTypeName(): string
    {
        return ProjectTypes.getProjectTypeName(this.typeGuid);
    }

    /**
     * Return a project guid with surrounding braces.
     */
    public getGuidWithBraces(): string
    {
        return "{" + this.guid + "}"
    }

    /**
     * Return the project path as multi-line text
     */
    public getProjectPath(): string
    {
        let result = "";
        let first = true;

        for(const folder of this.relativePath.split("\\"))
        {
            if(first)
            {
                result += `${folder}`;
                first = false;
            }
            else
            {
                result += `\n\\${folder}`;
            }
        }

        return result;
    }

    public getPathRange(): vscode.Range
    {
        const characterStart = this.line.text.indexOf(this.relativePath);
        const characterEnd = characterStart + this.relativePath.length;
        
        const start = new vscode.Position(this.line.lineNumber, characterStart);
        const end = new vscode.Position(this.line.lineNumber, characterEnd)

        const range = new vscode.Range(start, end);

        return range;
    }

    public IsSolutionFolder() : boolean
    {
        return this.typeGuid === "2150E333-8FDC-42A3-9474-1A3956D46DE8";
    }
}