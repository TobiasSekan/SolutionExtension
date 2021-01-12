import * as vscode from 'vscode';

export class solutionHover implements vscode.HoverProvider
{
    public constructor()
    {
    }

    public provideHover(
        document: vscode.TextDocument,
        position: vscode.Position,
        token: vscode.CancellationToken): Thenable<vscode.Hover>
    {
        return new Promise<vscode.Hover>((resolve, reject) =>
        {
            if(!document)
            {
                reject();
            }

            const result = this.analyzeText(document, position);
            if(result === "")
            {
                reject();
            }

            resolve(new vscode.Hover(new vscode.MarkdownString(result)));
        });
    }

    private analyzeText(document: vscode.TextDocument, position: vscode.Position): string
    {
        if(this.contains(document, position, "Microsoft Visual Studio Solution File, Format Version"))
        {
            return "Standard header that defines the file format version.";
        }

        if(this.contains(document, position, "# Visual Studio Version"))
        {
            return "The major version of Visual Studio that (most recently) saved this solution file. This information controls the version number in the solution icon.";
        }

        if(this.contains(document, position, "VisualStudioVersion"))
        {
            return "The full version of Visual Studio that (most recently) saved the solution file. If the solution file is saved by a newer version of Visual Studio that has the same major version, this value is not updated so as to lessen churn in the file.";
        }

        if(this.contains(document, position, "MinimumVisualStudioVersion"))
        {
            return "The minimum (oldest) version of Visual Studio that can open this solution file.";
        }

        if(this.contains(document, position, "GlobalSection"))
        {
            return "When the environment reads the GlobalSection('name') tag, it maps the name to a VSPackage using the registry. The key name should exist in the registry under [HKLM\\\<Application ID Registry Root\>\\SolutionPersistence\\AggregateGUIDs]. The keys' default value is the Package GUID (REG_SZ) of the VSPackage that wrote the entries.";
        }

        if(this.contains(document, position, "Project"))
        {
            return "This statement contains the unique project GUID and the project type GUID. This information is used by the environment to find the project file or files belonging to the solution, and the VSPackage required for each project. The project GUID is passed to IVsProjectFactory to load the specific VSPackage related to the project, then the project is loaded by the VSPackage. In this case, the VSPackage that is loaded for this project is Visual Basic. Each project can persist a unique project instance ID so that it can be accessed as needed by other projects in the solution. Ideally, if the solution and projects are under source code control, the path to the project should be relative to the path to the solution. When the solution is first loaded, the project files cannot be on the user's machine. By having the project file stored on the server relative to the solution file, it is relatively simple for the project file to be found and copied to the user's machine. It then copies and loads the rest of the files needed for the project.";
        }

        return "";
    }

    private contains(document: vscode.TextDocument, position: vscode.Position, pattern: string): boolean
    {
        const regEx = new RegExp(pattern);
        const range = document.getWordRangeAtPosition(position, regEx);

        if(range === undefined)
        {
            return false;
        }

        return true;
    }
}