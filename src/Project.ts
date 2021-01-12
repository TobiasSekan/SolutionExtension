import { projectTypes } from "./projectTypes";

export class Project
{
    public constructor(lineSplit: Array<string>)
    {
        this.typeGuid = lineSplit[1].replace("{", "").replace("}", "");;
        this.name = lineSplit[3];
        this.path = lineSplit[5];
        this.guid = lineSplit[7].replace("{", "").replace("}", "");
    }

    public typeGuid: string;

    public name: string;

    public path: string;

    public guid: string;

    public getProjectType(): string
    {
        return projectTypes.getProjectType(this.typeGuid);
    }

    public getGuidWithBraces(): string
    {
        return "{" + this.guid + "}"
    }
}