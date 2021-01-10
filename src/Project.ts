import { projectTypes } from "./projectTypes";

export class Project
{
    public constructor(projectLine: string)
    {
        const lineSplit = projectLine.split("\"");

        // Project(
        // {8BC9CEB8-8B4A-11D0-8D11-00A0C91BC942}
        // ) = 
        // ShortcutGuide
        // , 
        // src\modules\shortcut_guide\shortcut_guide.vcxproj
        //, 
        //{A46629C4-1A6C-40FA-A8B6-10E5102BB0BA}"

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
}