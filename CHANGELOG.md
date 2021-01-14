# Change Log

All notable changes to the "SolutionExtension" extension will be documented in this file.

Check [Keep a Changelog](http://keepachangelog.com/) for recommendations on how to structure this file.

## Finished -> Upcoming next

New:

* Show error for project GUIDs that used by another projects.

Changes:

* Internal: reduce diagnostic loops

## [1.3.0]

New:

* Show error for project files that was not found
* Show waring for project filename that differ from project name
* Show waring for project folders that differ from project name
* Show waring for project file extension that differ from project type
  * For `.csproj`, `.vcxproj`, `.vbproj` and `.shproj`
* Code completion for values `Debug|x86` and `Release|x86`
* CodeLens and code completion for project types
  * VB.NET SDK-style (`{778DAE3C-4631-46EA-AA77-85C1314464D9}`)
  * Shared Project SDK-style (`{D954291E-2A0B-460D-934E-DC6B0785DB48}`)

Remove:

* not correct working project type syntax highlight

## [1.2.0]

New:

* Clink on CodeLens of a project GUID jump to project line.
* Code completion for project types
* Code completion for keywords `SolutionNotes` and `ExtensibilityAddIns`
* Code completion for values `preSolution` and `postSolution`
* Code completion for property `RESX_SortFileContentOnSave`

Changes:

* Show project names instead of project GUIDs in the completion list

## [1.1.0]

New:

* Code completion

Fixes:

* Fix crash on lines with incomplete project information

## [1.0.3]

Fixes:

* More fixes for file trigger was not set to `*.sln` files.
* Remove not working `changlog.md` link in `redme.md` (`vsCode` and marketplace)

## [1.0.2]

Fixes:

* Fix file trigger was not set to `*.sln` files.
* Fix not wrong link to `changlog.md` in `readme.md`

## [1.0.1]

Fixes:

* Fix not wrong picture link in `readme.md`
* Add `VSIX` to `.gitignore`

## [1.0.0]

New:

* Syntax highlight
* Hover
  * For the first four lines (version)
  * For keyword `Project`
* Diagnostic
  * Show error for GUIDs that are not project GUIDs
  * Show warning for GUIDs that are used several times in "Nested Project" declaration
* CodeLens
  * For project type (GUIDs)
  * For `ProjectSection` (`ProjectDependencies`)
  * For `GlobalSelection` (`ProjectConfigurationPlatforms` and `NestedProjects`)
