# SolutionExtension

vsCode extension for Visual Studio solution files (*.sln)

## New in 1.3.0

* Show error for project files that was not found
* Show waring for project filename that differ from project name
* Show waring for project folders that differ from project name
* Show waring for project file extension that differ from project type
  * Currently for `.csproj`, `.vcxproj`, `.vbproj` and `.shproj`
* Code completion for values `Debug|x86` and `Release|x86`
* CodeLens and code completion for project types
  * VB.NET SDK-style (`{778DAE3C-4631-46EA-AA77-85C1314464D9}`)
  * Shared Project SDK-style (`{D954291E-2A0B-460D-934E-DC6B0785DB48}`)
* Remove: not correct working project type syntax highlight

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
