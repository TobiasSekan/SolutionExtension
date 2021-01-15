# SolutionExtension

vsCode extension for Visual Studio solution files (*.sln)

## New in 1.3.0

* CodeLens on project lines for "Project" nested in "Project".
* Show error for project GUIDs that used by another projects.
* Show error for unknown project type GUIDs.
* Show warning for project names that used by another projects.
* Show warning when module words have not correct PascalCase
  * For `Project`, `EndProject`, `ProjectSection`, `EndProjectSection`
  * And `Global`, `EndGlobal`, `GlobalSection`, `EndGlobalSection`
* Show info for solution folders, when name is used by another projects.
* Show the line number of the other usage in the diagnostic tooltip in nested project definition.
* Check file extension `.vcxitems` too (should be `C++` project)
* Code completion and syntax highlight for keyword `SharedMSBuildProjectFiles`.
* CodeLens on project lines show no "Project type ..." instead of type only.

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
* Hover
  * For the first four lines (version)
  * For keyword `Project`
* Diagnostic
  * Show error for GUIDs that are not project GUIDs
  * Show error for project files that was not found
  * Show warning for GUIDs that are used several times in `Nested Project` declaration
  * Show warning for project filename that differ from project name
  * Show warning for project folders that differ from project name
  * Show warning for project file extension that differ from project type
    * Currently for `.csproj`, `.vcxproj`, `.vbproj` and `.shproj`
* CodeLens
  * For project type GUIDs
  * For project GUIDs with action jump to project line

## Known Issues

* Only a few keywords have tooltips, because the official documentation doesn't contain more information.

## Missing a feature or found a bug?

* Please open a **new issues** under the [SolutionExtension](https://github.com/TobiasSekan/SolutionExtension/issues) repository
