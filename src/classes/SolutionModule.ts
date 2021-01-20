import * as vscode from 'vscode';

/**
 * A module inside of a solution with a start and a end line
 */
export abstract class SolutionModule
{
    public constructor(type: string, start: vscode.Position, end: vscode.Position)
    {
        this.Type = type;
        this.Start = start;
        this.End = end;
    }

    /**
     * The type of the global section
     */
    public Type: string;

    /**
     * The first line (inclusive) of the this module
     */
    public Start: vscode.Position;

    /**
     * The last line (inclusive) of the this module
     */
    public End: vscode.Position;

    /**
     * Return the range of the this module
     */
    public GetModuleRange(): vscode.Range
    {
        return new vscode.Range(this.Start, this.End);
    }
}