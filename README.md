# SolutionExtension

vsCode extension for Visual Studio solution files (*.sln)

## New/Changes/Fixes in Version 1.9.2

Fix:

* #80 - When open two or more files in different repositories the diagnostic was not working

## New/Changes/Fixes in Version 1.9.1

Fix:

* #79 - Diagnostic was not direct working when open a solution file inside a repository (SCM)
  * It was only working after the first typo
  * Including diff view and merge view

## New/Changes/Fixes in Version 1.9.0

New:

* #22 - Show error when line with file format is missing.
  * Line start with `Microsoft Visual Studio Solution File, Format Version`
* #22 - Show warnings when lines with visual studio versions are missing.
  * Line start with `VisualStudioVersion` and `MinimumVisualStudioVersion`
* #22 - Show info when comment line for visual studio major version is missing.
  * Line start with `# Visual Studio Version`
* #52 - Code completion for header (file format + comment + version lines)
* #68 - CodeLens show corresponding Visual Studio name on version lines.
  * e.g. `VisualStudioVersion = 16.0.31004.235` show `Visual Studio 2019`
  * e.g. `MinimumVisualStudioVersion = 10.0.40219.1` show `Visual Studio 2010`
* #67 - Inform about empty lines
  * Because: A hand of solution files have a empty first line
  * This was possible a bug in the old/legacy project system
* #77 - Code completion for project type `Docker Application`
  * GUID `E53339B2-1760-4266-BCC7-CA923CBCF16C`
* #77 - Diagnostic for file extension `*.dcproj`, must match project type GUID
  * of `E53339B2-1760-4266-BCC7-CA923CBCF16C` (Docker Application)

Improvements:

* #36 - Code completion for configuration values now show only defined configurations.
  * Configurations must be defined under `GlobalSection(SolutionConfigurationPlatforms)`
  * Trigger character is `=`
* #78 - Project extension was check against project type, but no vice versa.
  * Now the project extension is check against the project type.
  * And the project type is check against the project extension.

Changes:

* #77 - Project type `Docker Application` is no longer unknown
  * GUID `E53339B2-1760-4266-BCC7-CA923CBCF16C`

Fixes:

* #66 - Syntax highlight was not working for configurations without `Debug` or `Release`.
  * e.g. `Checked|x64`, `Linux|Any CPU`, `CodeCoverage|x68`, `AuditMode|Any CPU`
* #66 - Syntax highlight was not working for configurations with self-defined platforms.
  * e.g. `Release|DotNet_x64Test`, `Debug|ARM64`

## Picture

![picture](https://raw.githubusercontent.com/TobiasSekan/SolutionExtension/main/docs/readme.png)
_Color Theme: Dark+ (default dark)_

## Features

* Syntax highlight
* Navigation
  * Breadcrumbs
  * Symbol definition (`Ctrl+P` + `@`)
  * Workspace symbols (`Ctrl+P` + `#`)
  * File link support (`Ctrl+Click`)
  * Goto to definition + Peek definition
  * Goto to implementation + Peek implementation + Find all implementation
  * Goto to reference + Peek reference + Find all reference

* Diagnostic
  * Show error for GUIDs that are not project GUIDs
  * Show error for files that was not found
  * Show error for project GUIDs that used by another projects.
  * Show error for not defined configurations.
  * Show error for unknown project type GUIDs.
  * Show error for projects that have no `EndProject` entry
  * Show error when `SolutionGuid` is used by a project
  * Show error when `SolutionGuid` is reversed by a project type
  * Show error for missing parameters in project lines
  * Show warning for GUIDs that are used several times in `Nested Project` declaration
  * Show warning for project names that used by another projects.
  * Show warning for project filename that differ from project name
  * Show warning for project folders that differ from project name
  * Show warning for project file extension that differ from project type
    * For `.csproj`, `.vcxproj`,`.vcxitems`, `.vbproj`, `.shproj`, `.fsproj` and `.wapproj`
  * Show warning when project path have a extension, but it is a solution folder
  * Show warning when module words have not correct PascalCase
    * For `Project`, `EndProject`, `ProjectSection`, `EndProjectSection`
    * And `Global`, `EndGlobal`, `GlobalSection`, `EndGlobalSection`
  * Show info for solution folders, when name is used by another projects.
* Highlight all occurrences of a selected GUID
* CodeLens
  * Project lines: Type | (Open) Folder | Nested in "..."
  * For all used project GUIDs with action to jump to project line
* Code completion
  * Project GUIDs and Project type GUIDs
  * Module and snippets
  * Keywords and Properties
  * Values and constant
* Signature help for `Project`, `ProjectSection` and `GlobalSection`
* Hover
  * For the first four lines (version)
  * For keyword `Project`

## Known Issues

* Only a few keywords have tooltips, because the official documentation doesn't contain more information.

## Missing a feature or found a bug?

* Please open a **new issues** under the [SolutionExtension](https://github.com/TobiasSekan/SolutionExtension/issues) repository
