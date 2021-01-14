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

        this.Line = line;

        const lineSplit = line.text.trim().split("\"");

        this.ProjectType = lineSplit[1].replace("{", "").replace("}", "");;
        this.Name = lineSplit[3];
        this.RelativePath = lineSplit[5];
        this.Guid = lineSplit[7].replace("{", "").replace("}", "");

        if(path.isAbsolute(this.RelativePath))
        {
            this.AbsolutePath = this.RelativePath;
        }
        else
        {
            this.AbsolutePath = dir + path.sep + this.RelativePath;
        }
    }

    /** 
     * The text line that contains the project information.
     */
    public Line: vscode.TextLine;

    /**
     * The project type (GUID).
     */
    public ProjectType: string;

    /**
     * The name of the project.
     */
    public Name: string;

    /**
     * The relative path to the project.
     */
    public RelativePath: string;

    /**
     * The absolute path to the project.
     */
    public AbsolutePath: string;

    /**
     * The GUID of the project that is used in another places inside the solution.
     */
    public Guid: string;

    //#region Public Methods

    /**
     * Indicate if the project is a solution folder
     */
    public IsSolutionFolder() : boolean
    {
        return this.ProjectType === "2150E333-8FDC-42A3-9474-1A3956D46DE8";
    }

    /**
     * Return the project type name of this project.
     */
    public GetProjectTypeName(): string
    {
        return ProjectTypes.GetProjectTypeName(this.ProjectType);
    }

    /**
     * Return a project guid with surrounding braces.
     */
    public GetGuidWithBraces(): string
    {
        return "{" + this.Guid + "}"
    }

    /**
     * Return the project path as multi-line text
     */
    public GetProjectPath(): string
    {
        let result = "";
        let first = true;

        for(const folder of this.RelativePath.split(path.sep))
        {
            if(first)
            {
                result += `${folder}`;
                first = false;
            }
            else
            {
                result += `\n${path.sep}${folder}`;
            }
        }

        return result;
    }

    /**
     * Return the filename of the project with the extension
     */
    public GetProjectFileName(): string
    {
        return path.basename(this.RelativePath);
    }

    /**
     * Return the filename of the project without an extension
     */
    public GetProjectFileNameWithoutExtension(): string
    {
        const fileName = path.basename(this.RelativePath);

        const lastPointPosition = fileName.lastIndexOf(".");
        if(lastPointPosition < 1)
        {
            return fileName;
        }

        return fileName.substring(0, lastPointPosition);
    }

    /**
     * Return the file extension of the project file
     */
    public GetProjectFileNameExtension(): string
    {
        return path.extname(this.RelativePath)
    }

    /**
     * Return the project folder (last part of the project path)
     */
    public GetProjectFolder(): string
    {
        const dir = path.dirname(this.RelativePath);

        const dirSplit = dir.split(path.sep);

        if(dirSplit.length === 0)
        {
            return "";
        }

        return dirSplit[dirSplit.length - 1];
    }

    //#endregion Public Methods

    //#region Public Methods - Ranges

    /**
     * Return the range of the path of the project line
     */
    public GetPathRange(): vscode.Range
    {
        const characterStart = this.Line.text.indexOf(this.RelativePath);
        const characterEnd = characterStart + this.RelativePath.length;
        
        return this.GetRange(characterStart, characterEnd);
    }

    /**
     * Return the range of the filename without extension of the project line
     */
    public GetFileNameWithoutExtensionRange(): vscode.Range
    {
        const fileName = this.GetProjectFileName();
        const fileNameWithoutExtension = this.GetProjectFileNameWithoutExtension();

        const characterStart = this.Line.text.indexOf(fileName);
        const characterEnd = characterStart + fileNameWithoutExtension.length;

        return this.GetRange(characterStart, characterEnd);
    }

    /**
     * Return the range of the file extension of the project line
     */
    public GetFileExtensionRange(): vscode.Range
    {
        const fileNameExtension = this.GetProjectFileNameExtension();

        const characterStart = this.Line.text.indexOf(fileNameExtension) + 1;
        const characterEnd = characterStart + fileNameExtension.length;

        return this.GetRange(characterStart, characterEnd);
    }

    /**
     * Return the range of the project folder (last folder part) of the project line
     */
    public GetProjectFolderRange(): vscode.Range
    {
        const projectFolder = this.GetProjectFolder();

        const search = projectFolder + path.sep + this.GetProjectFileName();

        const characterStart = this.Line.text.indexOf(search);
        const characterEnd = characterStart + projectFolder.length;

        return this.GetRange(characterStart, characterEnd);
    }

    /**
     * Return the range of the project GUID of the project line
     */
    public GetProjectGuidRange(): vscode.Range
    {
        const characterStart = this.Line.text.indexOf(this.Guid);
        const characterEnd = characterStart + this.Guid.length;

        return this.GetRange(characterStart, characterEnd);
    }

    /**
     * Return the range of the project name of the project line
     */
    public GetProjectNameRange(): vscode.Range
    {
        const characterStart = this.Line.text.indexOf(this.Name);
        const characterEnd = characterStart + this.Name.length;

        return this.GetRange(characterStart, characterEnd);
    }

    /**
     * Return the range of the project type of the project line
     */
    public GetProjectTypeRange(): vscode.Range
    {
        const characterStart = this.Line.text.indexOf(this.ProjectType);
        const characterEnd = characterStart + this.ProjectType.length;

        return this.GetRange(characterStart, characterEnd);
    }

    //#endregion Public Methods - Ranges

    //#region Private Methods

    /**
     * Return a range for the given character range
     * @param characterStart The first character of the range
     * @param characterEnd The last character of the range
     */
    private GetRange(characterStart: number, characterEnd: number): vscode.Range
    {
        const start = new vscode.Position(this.Line.lineNumber, characterStart);
        const end = new vscode.Position(this.Line.lineNumber, characterEnd)

        return new vscode.Range(start, end);
    }

    //#endregion Private Methods
}