# SolutionExtension

vsCode extension for Visual Studio solution files (*.sln)

## New/Changes/Fixes in Version 1.8.0

New:

* #61 - Code completion for project type `F# SDK-Style`
  * GUID `6EC3EE1D-3C4E-46DD-8F32-0CC8E7565705`
* #62 - Code completion for project type `Windows Application Packaging`
  * GUID `C7167F0D-BC9F-4E6E-AFE1-012C56B48DB5`
* #61 - Diagnostic for file extension `*.fsproj`, must match project type GUID
  * of `6EC3EE1D-3C4E-46DD-8F32-0CC8E7565705` (F#)
  * or `F2A71F9B-5D33-465A-A702-920D77279786` (F# SDK-style)
* #62 - Diagnostic for file extension `*.wapproj`, must match project type GUID
  * of `C7167F0D-BC9F-4E6E-AFE1-012C56B48DB5` (Windows Application Packaging)
* #60 - Show error when `SolutionGuid` is used by a project
* #60 - Show error when `SolutionGuid` is reversed by a project type
* #64 - Show error for missing parameters in project lines

Improvement:

* #63 - Support for unfinished project lines
  * That means that all features now working for this lines too

Changes:

* #61 - Project type `F# SDK-style` is no longer unknown
  * GUID `6EC3EE1D-3C4E-46DD-8F32-0CC8E7565705`
* #62 - Project type `Windows Application Packaging` is no longer unknown
  * GUID `C7167F0D-BC9F-4E6E-AFE1-012C56B48DB5`

Fixes:

* #58 - Diagnostic was not triggered when language was changed to `sln`
* Diagnostic was not cleared when language was changed away from `sln`
* #59 - Syntax highlight was not working for a hand of self-defined configurations
  * e.g. `LinuxDebug|Any CPU`, `Debug-netcoreapp3_1|Any CPU`, `Code Analysis Debug|x86`
* #65 - Syntax highlight was not working for configurations with additional points in the name
  * e.g. `Desktop.Release|Any CPU.ActiveCfg`
* #65 - False positive on diagnostics for configurations with additional points in the name

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
  * Show warning for GUIDs that are used several times in `Nested Project` declaration
  * Show warning for project names that used by another projects.
  * Show warning for project filename that differ from project name
  * Show warning for project folders that differ from project name
  * Show warning for project file extension that differ from project type
    * Currently for `.csproj`, `.vcxproj`,`.vcxitems`, `.vbproj` and `.shproj`
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
