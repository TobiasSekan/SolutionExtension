# SolutionExtension

vsCode extension for Visual Studio solution files (*.sln)

## New in 1.5.0

New:

* CodeLens - Open project file and project folder from CodeLens on project lines.
* Show Error
  * When files paths in `ProjectSection(SolutionItems)` was not found.
  * When a configurations under `GlobalSection(ProjectConfigurationPlatforms)` is not defined.
    * They must defined in `GlobalSection(SolutionConfiguration)`

Improvements:

* Show warning when project path have a extension, but it is a solution folder.
* Show more useful warning message for more times nested projects.

Changes:

* Found project GUIDs in lower case are now a info instead of an error.
* Rename `Project type` to `Type` to save space in CodeLens line on projects
* Remove leftover from vsCode beginners extension example

Fixes:

* Show warning for all lines with more times nested projects.
* Project path that start with a ".." have no syntax highlight.

## Picture

![picture](https://raw.githubusercontent.com/TobiasSekan/SolutionExtension/main/docs/readme.png)
_Color Theme: Dark+ (default dark)_

## Features

* Syntax highlight
* Code completion
  * Project GUIDs and Project type GUIDs
  * Module and snippets
  * Keywords and Properties
  * Values and constant
* CodeLens
  * Project lines: Type | (Open) Folder | (Open) File | Nested in "..."
  * For all used project GUIDs with action to jump to project line
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
* Hover
  * For the first four lines (version)
  * For keyword `Project`

## Known Issues

* Only a few keywords have tooltips, because the official documentation doesn't contain more information.

## Missing a feature or found a bug?

* Please open a **new issues** under the [SolutionExtension](https://github.com/TobiasSekan/SolutionExtension/issues) repository
