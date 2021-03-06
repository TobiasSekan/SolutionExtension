import * as vscode from 'vscode';
import * as path from 'path';
import { ProjectTypes } from "../Projects/ProjectTypes";
import { SolutionModule } from './SolutionModule';
import { VscodeHelper } from '../Helper/vscodeHelper';
import { ProjectSection } from './ProjectSection';

/**
 * A project inside a solution.
 */
export class Project extends SolutionModule
{
    /**
     * Crate a new project, based on the given (raw) project line string.
     * @param line The line that contains the project information.
     */
    public constructor(textDocument: vscode.TextDocument, start: vscode.Position, end: vscode.Position)
    {
        super("Project", start, end)

        this.NestedInProjects = new Array<[vscode.TextLine, string]>();
        this.SolutionItems = new Array<vscode.TextLine>();
        this.ProjectSections = new Array<ProjectSection>();

        this.Line = textDocument.lineAt(start.line);
        const lineSplit = this.Line.text.trim().split("\"");

        this.ProjectType = lineSplit.length > 1
            ? lineSplit[1].replace("{", "").replace("}", "")
            : "";

        this.Name = lineSplit.length > 3
            ? lineSplit[3]
            : ""

        this.RelativePath = lineSplit.length > 5
            ? lineSplit[5]
            : ""

        this.Guid = lineSplit.length > 7
            ? lineSplit[7].replace("{", "").replace("}", "")
            : ""

        this.AbsolutePath = VscodeHelper.GetAbsoluteFilePath(textDocument, this.RelativePath);
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

    /**
     * List with project where the project is nested
     */
    public NestedInProjects: Array<[vscode.TextLine, string]>;

    /**
     * List with all solution items of this project
     * TODO: replace/remove this
     */
    public SolutionItems: Array<vscode.TextLine>;

    public ProjectSections: Array<ProjectSection>;

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
        return `{${this.Guid}}`;
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
        return path.extname(this.RelativePath);
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
        return VscodeHelper.GetRange(this.Line, this.RelativePath, this.RelativePath);
    }

    /**
     * Return the range of the filename without extension of the project line
     */
    public GetFileNameWithoutExtensionRange(): vscode.Range
    {
        const fileName = this.GetProjectFileName();
        const fileNameWithoutExtension = this.GetProjectFileNameWithoutExtension();

        return VscodeHelper.GetRange(this.Line, fileName, fileNameWithoutExtension);
    }

    /**
     * Return the range of the file extension of the project line
     */
    public GetFileExtensionRange(): vscode.Range
    {
        const fileNameExtension = this.GetProjectFileNameExtension();

        return VscodeHelper.GetRange(
            this.Line,
            fileNameExtension,
            fileNameExtension,
            /*relativePosition:*/ 1);
    }

    /**
     * Return the range of the project folder (last folder part) of the project line
     */
    public GetProjectFolderRange(): vscode.Range
    {
        const projectFolder = this.GetProjectFolder();
        const search = projectFolder + path.sep + this.GetProjectFileName();

        return VscodeHelper.GetRange(this.Line, search, projectFolder);
    }

    /**
     * Return the range of the project GUID of the project line
     */
    public GetProjectGuidRange(): vscode.Range
    {
        return VscodeHelper.GetRange(this.Line, this.Guid, this.Guid);
    }

    /**
     * Return the range of the project name of the project line
     */
    public GetProjectNameRange(): vscode.Range
    {
        return VscodeHelper.GetRange(this.Line, this.Name, this.Name);
    }

    /**
     * Return the range of the project type of the project line
     */
    public GetProjectTypeRange(): vscode.Range
    {
        return VscodeHelper.GetRange(this.Line, this.ProjectType, this.ProjectType);
    }

    //#endregion Public Methods - Ranges
}