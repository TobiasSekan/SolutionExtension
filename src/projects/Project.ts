import * as vscode from 'vscode';
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
    public constructor(line: vscode.TextLine)
    {
        this.line = line;

        const lineSplit = line.text.trim().split("\"");

        this.typeGuid = lineSplit[1].replace("{", "").replace("}", "");;
        this.name = lineSplit[3];
        this.path = lineSplit[5];
        this.guid = lineSplit[7].replace("{", "").replace("}", "");

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
     * The absolute or relative path to the project.
     */
    public path: string;

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

        for(const folder of this.path.split("\\"))
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
}