// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import { CancellationToken, ExtensionContext, Hover, HoverProvider, languages, MarkdownString, Position, Range, TextDocument } from 'vscode';

class GoHoverProvider implements HoverProvider
{
    public provideHover(document: TextDocument, position: Position, token: CancellationToken): Thenable<Hover>
    {
        return new Promise<Hover>((resolve, reject) =>
        {
            const result = analyzeText(document, position);
            if(result === "")
            {
                reject();
            }

            resolve(new Hover(new MarkdownString(result)));
        });
    }
}

export function activate(ctx: ExtensionContext): void
{
    ctx.subscriptions.push(languages.registerHoverProvider("sln", new GoHoverProvider()));
}

function analyzeText(document: TextDocument, position: Position): string
{
    if(contains(document, position, "\"{[0-9A-F]{8}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{12}}\""))
    {
        let guid = getText(document, position, "\"{[0-9A-F]{8}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{12}}\"");
        guid = guid.replace(/^"(.*)"$/, '$1');

        const projectType = getProjectType(guid);

        return "Project type: " + projectType + "GUID: " + guid;
    }
    
    if(contains(document, position, "Microsoft Visual Studio Solution File, Format Version"))
    {
        return "Standard header that defines the file format version.";
    }

    if(contains(document, position, "# Visual Studio Version"))
    {
        return "The major version of Visual Studio that (most recently) saved this solution file. This information controls the version number in the solution icon.";
    }

    if(contains(document, position, "VisualStudioVersion"))
    {
        return "The full version of Visual Studio that (most recently) saved the solution file. If the solution file is saved by a newer version of Visual Studio that has the same major version, this value is not updated so as to lessen churn in the file.";
    }

    if(contains(document, position, "MinimumVisualStudioVersion"))
    {
        return "The minimum (oldest) version of Visual Studio that can open this solution file.";
    }

    if(contains(document, position, "GlobalSection"))
    {
        return "When the environment reads the GlobalSection('name') tag, it maps the name to a VSPackage using the registry. The key name should exist in the registry under [HKLM\\\<Application ID Registry Root\>\\SolutionPersistence\\AggregateGUIDs]. The keys' default value is the Package GUID (REG_SZ) of the VSPackage that wrote the entries.";
    }

    if(contains(document, position, "Project"))
    {
        return "This statement contains the unique project GUID and the project type GUID. This information is used by the environment to find the project file or files belonging to the solution, and the VSPackage required for each project. The project GUID is passed to IVsProjectFactory to load the specific VSPackage related to the project, then the project is loaded by the VSPackage. In this case, the VSPackage that is loaded for this project is Visual Basic. Each project can persist a unique project instance ID so that it can be accessed as needed by other projects in the solution. Ideally, if the solution and projects are under source code control, the path to the project should be relative to the path to the solution. When the solution is first loaded, the project files cannot be on the user's machine. By having the project file stored on the server relative to the solution file, it is relatively simple for the project file to be found and copied to the user's machine. It then copies and loads the rest of the files needed for the project.";
    }

    return "";
}

function contains(document: TextDocument, position: Position, pattern: string): boolean
{
    const regEx = new RegExp(pattern);
    const range = document.getWordRangeAtPosition(position, regEx);

    if(range === undefined)
    {
        return false;
    }

    return true;
}

function getText(document: TextDocument, position: Position, pattern: string): string
{
    const regEx = new RegExp(pattern);
    const range = document.getWordRangeAtPosition(position, regEx);

    if(range === undefined)
    {
        return "";
    }

    return document.getText(range)
}

function getProjectType(guid: string): string
{
    switch(guid)
    {
        case "{06A35CCD-C46D-44D5-987B-CF40FF872267}": return "Deployment Merge Module";
        case "{14822709-B5A1-4724-98CA-57A101D1B079}": return "Workflow (C#)";
        case "{20D4826A-C6FA-45DB-90F4-C717570B9F32}": return "Legacy (2003) Smart Device (C#)";
        case "{2150E333-8FDC-42A3-9474-1A3956D46DE8}": return "Solution Folder";
        case "{2DF5C3F4-5A5F-47a9-8E94-23B4456F55E2}": return "XNA (XBox)";
        case "{32F31D43-81CC-4C15-9DE6-3FC5453562B6}": return "Workflow Foundation";
        case "{349C5851-65DF-11DA-9384-00065B846F21}": return "Web Application (incl. MVC 5)";
        case "{3AC096D0-A1C2-E12C-1390-A8335801FDAB}": return "Test";
        case "{3D9AD99F-2412-4246-B90B-4EAA41C64699}": return "Windows Communication Foundation (WCF)";
        case "{3EA9E505-35AC-4774-B492-AD1749C4943A}": return "Deployment Cab";
        case "{4D628B5B-2FBC-4AA6-8C16-197242AEB884}": return "Smart Device (C#)";
        case "{4F174C21-8C12-11D0-8340-0000F80270F8}": return "Database (other project types)";
        case "{54435603-DBB4-11D2-8724-00A0C9A8B90C}": return "Visual Studio 2015 Installer Project Extension";
        case "{593B0543-81F6-4436-BA1E-4747859CAAE2}": return "SharePoint (C#)";
        case "{603C0E0B-DB56-11DC-BE95-000D561079B0}": return "ASP.NET MVC 1.0";
        case "{60DC8134-EBA5-43B8-BCC9-BB4BC16C2548}": return "Windows Presentation Foundation (WPF)";
        case "{68B1623D-7FB9-47D8-8664-7ECEA3297D4F}": return "Smart Device (VB.NET)";
        case "{66A26720-8FB5-11D2-AA7E-00C04F688DDE}": return "Project Folders";
        case "{6BC8ED88-2882-458C-8E55-DFD12B67127B}": return "MonoTouch";
        case "{6D335F3A-9D43-41b4-9D22-F6F17C4BE596}": return "XNA (Windows)";
        case "{76F1466A-8B6D-4E39-A767-685A06062A39}": return "Windows Phone 8/8.1 Blank/Hub/Webview App";
        case "{786C830F-07A1-408B-BD7F-6EE04809D6DB}": return "Portable Class Library";
        case "{8BB2217D-0F2D-49D1-97BC-3654ED321F3B}": return "ASP.NET 5";
        case "{8BC9CEB8-8B4A-11D0-8D11-00A0C91BC942}": return "C++";
        case "{978C614F-708E-4E1A-B201-565925725DBA}": return "Deployment Setup";
        case "{A1591282-1198-4647-A2B1-27E5FF5F6F3B}": return "Silverlight";
        case "{A5A43C5B-DE2A-4C0C-9213-0A381AF9435A}": return "Universal Windows Class Library";
        case "{A860303F-1F3F-4691-B57E-529FC101A107}": return "Visual Studio Tools for Applications (VSTA)";
        case "{A9ACE9BB-CECE-4E62-9AA4-C7E7C5BD2124}": return "Database";
        case "{AB322303-2255-48EF-A496-5904EB18DA55}": return "Deployment Smart Device Cab";
        case "{B69E3092-B931-443C-ABE7-7E7B65F2A37F}": return "Micro Frmework";
        case "{BAA0C2D2-18E2-41B9-852F-F413020CAA33}": return "Visual Studio Tools for Office (VSTO)";
        case "{BC8A1FFA-BEE3-4634-8014-F334798102B3}": return "Windows Store Apps (Metro Apps)";
        case "{BF6F8E12-879D-49E7-ADF0-5503146B24B8}": return "C# in Dynamics 2012 AX AOT";
        case "{C089C8C0-30E0-4E22-80C0-CE093F111A43}": return "Windows Phone 8/8.1 App (C#)";
        case "{C252FEB5-A946-4202-B1D4-9916A0590387}": return "Visual Database Tools";
        case "{CB4CE8C6-1BDB-4DC7-A4D3-65A1999772F8}": return "Legacy (2003) Smart Device (VB.NET)";
        case "{D399B71A-8929-442a-A9AC-8BEC78BB2433}": return "XNA (Zune)";
        case "{D59BE175-2ED0-4C54-BE3D-CDAA9F3214C8}": return "Workflow (VB.NET)";
        case "{DB03555F-0C8B-43BE-9FF9-57896B3C5E56}": return "Windows Phone 8/8.1 App (VB.NET)";
        case "{E24C65DC-7377-472B-9ABA-BC803B73C61A}": return "Web Site";
        case "{E3E379DF-F4C6-4180-9B81-6769533ABE47}": return "ASP.NET MVC 4.0";
        case "{E53F8FEA-EAE0-44A6-8774-FFD645390401}": return "ASP.NET MVC 3.0";
        case "{E6FDF86B-F3D1-11D4-8576-0002A516ECE8}": return "J#";
        case "{EC05E597-79D4-47f3-ADA0-324C4F7C7484}": return "SharePoint (VB.NET)";
        case "{EFBA0AD7-5A72-4C68-AF49-83D382785DCF}": return "Xamarin.Android / Mono for Android";
        case "{F135691A-BF7E-435D-8960-F99683D2D49C}": return "Distributed System";
        case "{F184B08F-C81C-45F6-A57F-5ABD9991F28F}": return "VB.NET";
        case "{F2A71F9B-5D33-465A-A702-920D77279786}": return "F#";
        case "{F5B4F3BC-B597-4E2B-B552-EF5D8A32436F}": return "MonoTouch Binding";
        case "{F85E285D-A4E0-4152-9332-AB1D724D3325}": return "ASP.NET MVC 2.0";
        case "{F8810EC1-6754-47FC-A15F-DFABD2E3FA90}": return "SharePoint Workflow";
        case "{FAE04EC0-301F-11D3-BF4B-00C04F79EFBC}": return "C#";

        default:
            return "Unknown project type";
    }
}