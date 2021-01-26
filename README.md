# SolutionExtension

vsCode extension for Visual Studio solution files (*.sln)

## Version 1.7.0

New:

* #49 - Show error when a project have no `EndProject` entry
* Support document link for files unter `ProjectSection(SolutionItems)`
* Show signature help for `Project`, `ProjectSection` and `GlobalSection`
* Support for workspace symbols (`Ctrl+P` + `#`)
  * Works only for project files of the solution
  * Works only when the **active** editor has open a solution file (*.sln)

Improvements:

* Syntax highlight for lowercase GUIDs
* Right-hand numbers under `GlobalSection(SharedMSBuildProjectFiles)` are now highlighted as variables
* Code completion now offers elements only when useful and allowed
  * see Changelog for detailed information
* Entries under `ProjectConfigurationPlatforms` are now better highlighted
  * e.g. "Debug|x86" was two separate words, now it is only one word
  * e.g. ".Debug|x64.ActiveCfg" was three separate words, now it is only one word
* Code completion for configuration (properties and values)
  * `Debug|Any CPU` instead of `Debug|Any`
  * `Release|Any CPU` instead of `Release|Any`

Changes:

* #49 - GUIDs from projects without `EndProject` entry produce no longer a error
  * We show now a extra error for missing `EndProject`
* Lowercase project GUIDs under `GlobalSection(SharedMSBuildProjectFiles)` produces no longer a info
* The trigger chartachter `"` is no longer working for project types (GUIDs)
  * because of improved code completion

Fixes:

* Problems window was not clear after close a solution file.
* #35 - Fix wrong syntax highlight for words in paths
  * e.g. "Debug" was found in "Debug.cmd"
  * e.g. "Debug" was found in "CodeAnalysis.Debugging"

## Picture

![picture](https://raw.githubusercontent.com/TobiasSekan/SolutionExtension/main/docs/readme.png)
_Color Theme: Dark+ (default dark)_

## Features

* Syntax highlight
* Navigation
  * Breadcrumbs
  * Goto to definition + Peek definition
  * Goto to implementation + Peek implementation + Find all implementation
  * Goto to reference + Peek reference + Find all reference
  * Symbol definition (`Ctrl+P` + `@`)
  * Highlight all occurrences of a GUID
  * File link support (`Ctrl+Click`)
* Diagnostic
  * Show error for GUIDs that are not project GUIDs
  * Show error for files that was not found
  * Show error for project GUIDs that used by another projects.
  * Show error for not defined configurations.
  * Show error for unknown project type GUIDs.
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
* Code completion
  * Project GUIDs and Project type GUIDs
  * Module and snippets
  * Keywords and Properties
  * Values and constant
* CodeLens
  * Project lines: Type | (Open) Folder | Nested in "..."
  * For all used project GUIDs with action to jump to project line
* Hover
  * For the first four lines (version)
  * For keyword `Project`

## Known Issues

* Only a few keywords have tooltips, because the official documentation doesn't contain more information.

## Missing a feature or found a bug?

* Please open a **new issues** under the [SolutionExtension](https://github.com/TobiasSekan/SolutionExtension/issues) repository
