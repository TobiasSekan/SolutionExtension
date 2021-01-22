# Change Log

All notable changes to the "SolutionExtension" extension will be documented in this file.

Check [Keep a Changelog](http://keepachangelog.com/) for recommendations on how to structure this file.

## Next version

Improvements:

* Entries under "ProjectConfigurationPlatforms" are now better highlighted
  * e.g. "Debug|x86" was two separate words, now its only one word
  * e.g. ".Debug|x64.ActiveCfg" was three separate words, now its only one word

Fixes:

* #35 - Fix wrong syntax highlight for words in paths
  * e.g. "Build" was found in "Build.cmd"
  * e.g. "Build" was found in "CodeAnalysis.Debugging"

## [1.6.0]

New:

* #46 - Highlight all occurrences of a symbol in a document (for GUIDs)
* #42 - Goto definition of a symbol (via `F12` or context-menu)
* #50 - Goto implementation of a symbol (via `Ctrl+F12` or context-menu)
* #48 - Goto reference of a symbol (via `Shift+F12` or context-menu)
* #48 - Find all references of a symbol (via `Shift+Alt+F12` or context-menu)
* #38 - Show all symbol definitions within a document (via `Ctrl+P` + `@`)
* #38 - Show Breadcrumbs
* #51 - File link support (Ctrl+Click to open)

Remove:

* Don't longer show file (+action) in CodeLens, replaced by file link support

## [1.5.0]

New:

* #37 - Open project file and project folder from CodeLens on project lines.
* #25 - Check files paths of solution items (`ProjectSection(SolutionItems)`).
* #10 - Check use configurations under `GlobalSection'(ProjectConfigurationPlatforms)`
  * They must defined in `GlobalSection(SolutionConfiguration)`

Improvements:

* #32 - Show warning when project path have a extension, but it is a solution folder.
* #28 - Show more useful warning message for more times nested projects.

Changes:

* #30 - Found project GUIDs in lower case are now a info instead of an error.
* Rename `Project type` to `Type` to save space in CodeLens line on projects
* Remove leftover from vsCode beginners extension example

Fixes:

* #28 - Show warning for all lines with more times nested projects.
* #33 - Project path that start with a ".." have no syntax highlight.

## [1.4.0]

New:

* #31 - CodeLens on project lines for "Project" nested in "Project".
* #2 - Show error for project GUIDs that used by another projects.
* #9 - Show error for unknown project type GUIDs.
* #3 - Show warning for project names that used by another projects.
* #27 - Show warning when module words have not correct PascalCase
  * For `Project`, `EndProject`, `ProjectSection`, `EndProjectSection`
  * And `Global`, `EndGlobal`, `GlobalSection`, `EndGlobalSection`
* Show info for solution folders, when name is used by another projects.

Improvements:

* #29 - Check file extension `.vcxitems` too (should be `C++` project)
* #20 - Code completion and syntax highlight for keyword `SharedMSBuildProjectFiles`.
* Show the line number of the other usage in the diagnostic tooltip in nested project definition.

Changes:

* CodeLens on project lines show no "Project type ..." instead of type only.
* don't longer underline between file name and file extension.
  * Make simultaneously warnings from file name and file extension more clear.
* Internal: reduce diagnostic loops.

## [1.3.0]

New:

* #1 - Show error for project files that was not found
* #15 - Show warning for project filename that differ from project name
* #14 - Show warning for project folders that differ from project name
* #18 - Show warning for project file extension that differ from project type
  * For `.csproj`, `.vcxproj`, `.vbproj` and `.shproj`

Improvements:

* #21 - Code completion for values `Debug|x86` and `Release|x86`
* #19 - CodeLens and code completion for project types
  * VB.NET SDK-style (`{778DAE3C-4631-46EA-AA77-85C1314464D9}`)
  * Shared Project SDK-style (`{D954291E-2A0B-460D-934E-DC6B0785DB48}`)

Changes:

* Remove not correct working project type syntax highlight

## [1.2.0]

New:

* Clink on CodeLens of a project GUID jump to project line.
* #13 - Code completion for project types

Improvements:

* Code completion for keywords `SolutionNotes` and `ExtensibilityAddIns`
* Code completion for values `preSolution` and `postSolution`
* Code completion for property `RESX_SortFileContentOnSave`

Changes:

* Show project names instead of project GUIDs in the completion list

## [1.1.0]

New:

* #4 - Code completion for Snippet and modules
* #5 - Code completion for values
* #6 - Code completion for used project GUIDs
* #7 - Code completion for keywords
* #8 - Code completion for properties

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
* Internal: Add `VSIX` to `.gitignore`

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
