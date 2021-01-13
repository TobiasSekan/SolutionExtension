# SolutionExtension

vsCode extension for Visual Studio solution files (*.sln)

## New in [1.2.0]

* New: Clink on CodeLens of a project GUID jump to project line.
* New: Code completion for project types
* New: Code completion for keywords `SolutionNotes` and `ExtensibilityAddIns`
* New: Code completion for values `preSolution` and `postSolution`
* New: Code completion for property `RESX_SortFileContentOnSave`
* Changed: Show project names instead of project GUIDs in the completion list

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
  * Show warning for GUIDs that are used several times in "Nested Project" declaration
* CodeLens
  * For project type GUIDs
  * For project GUIDs with jump to project line action

## Known Issues

* Only a few keywords have tooltips, because the official documentation doesn't contain more information.

## Missing a feature or found a bug?

* Please open a **new issues** under the [SolutionExtension](https://github.com/TobiasSekan/SolutionExtension/issues) repository
