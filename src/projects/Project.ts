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

    //#region Public Methods

    /**
     * Indicate if the project is a solution folder
     */
    public isSolutionFolder() : boolean
    {
        return this.typeGuid === "2150E333-8FDC-42A3-9474-1A3956D46DE8";
    }

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

    /**
     * Return the filename of the project with the extension
     */
    public getProjectFileName()
    {
        return path.basename(this.relativePath);
    }

    /**
     * Return the filename of the project without an extension
     */
    public getProjectFileNameWithoutExtension()
    {
        const fileName = this.getProjectFileName();

        const lastPointPosition = fileName.lastIndexOf(".");
        if(lastPointPosition < 1)
        {
            return fileName;
        }

        return fileName.substring(0, lastPointPosition);
    }

    //#endregion Public Methods

    //#region Public Methods - Ranges

    /**
     * Return the range of the path of the project line
     */
    public getPathRange(): vscode.Range
    {
        const characterStart = this.line.text.indexOf(this.relativePath);
        const characterEnd = characterStart + this.relativePath.length;
        
        return this.getRange(characterStart, characterEnd);
    }

    /**
     * Return the range of the filename without extension of the project line
     */
    public getFileNameWithoutExtensionRange(): vscode.Range
    {
        const fileName = this.getProjectFileName();
        const fileNameWithoutExtension = this.getProjectFileNameWithoutExtension();

        const characterStart = this.line.text.indexOf(fileName);
        const characterEnd = characterStart + fileNameWithoutExtension.length;

        return this.getRange(characterStart, characterEnd);
    }

    //#endregion Public Methods - Ranges

    //#region Private Methods

    /**
     * Return a range for the given character range
     * @param characterStart The first character of the range
     * @param characterEnd The last character of the range
     */
    private getRange(characterStart: number, characterEnd: number): vscode.Range
    {
        const start = new vscode.Position(this.line.lineNumber, characterStart);
        const end = new vscode.Position(this.line.lineNumber, characterEnd)

        return new vscode.Range(start, end);
    }

    //#endregion Private Methods
}