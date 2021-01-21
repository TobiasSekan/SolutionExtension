# SolutionExtension

vsCode extension for Visual Studio solution files (*.sln)

## New in 1.6.0

New:

* #38 - Show Breadcrumbs
* #38 - Show all symbol definitions within a document (via `Ctrl+P` + `@`)
* #42 - Goto to definition + Peek definition
* #50 - Goto to implementation + Peek implementation + Find all implementation
* #48 - Goto to reference + Peek reference + Find all reference
* #46 - Highlight all occurrences of a symbol in a document (for GUIDs)
* #51 - File link support (`Ctrl+Click` to open)

Remove:

* Don't longer show file (+action) in CodeLens, replaced by file link support

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
