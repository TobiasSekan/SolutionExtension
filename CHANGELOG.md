# Change Log

All notable changes to the "SolutionExtension" extension will be documented in this file.

Check [Keep a Changelog](http://keepachangelog.com/) for recommendations on how to structure this file.

## Next version

New:

* #77 - Support for "Docker Application"
  * Project type : `{E53339B2-1760-4266-BCC7-CA923CBCF16C}`
  * Project file extension should: `.dcproj`
* #22 - Show error when line with file format is missing
  * Line start with `Microsoft Visual Studio Solution File, Format Version`
* #22 - Show warnings when lines with visual studio versions are missing
  * Line start with `VisualStudioVersion` and `MinimumVisualStudioVersion`
* #22 - Show info when comment line for visual studio major version is missing
  * Line start with `# Visual Studio Version`
* #68 - CodeLens show corresponding Visual Studio name on version lines
  * e.g. `VisualStudioVersion = 16.0.31004.235` show `Visual Studio 2019`
  * e.g. `MinimumVisualStudioVersion = 10.0.40219.1` show `Visual Studio 2010`
* #52 - Code completion for header (file format + comment + version lines)

Improvements:

* #36 - Code completion for configuration values now show only defined configurations
  * Configurations must be defined under `GlobalSection(SolutionConfigurationPlatforms)`
  * Trigger character is `=`

Fixes:

* #66 - Syntax highlight was not working for configurations without `Debug` or `Release`
  * e.g. `Checked|x64`, `Linux|Any CPU`, `CodeCoverage|x68`, `AuditMode|Any CPU`
* #66 - Syntax highlight was not working for configurations with self-defined platforms
  * e.g. `Release|DotNet_x64Test`, `Debug|ARM64`

## [1.8.0]

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

## [1.7.0]

New:

* #49 - Show error when a project have no `EndProject` entry
* Support document link for files unter `ProjectSection(SolutionItems)`
* Show signature help for `Project`, `ProjectSection` and `GlobalSection`
* Support for workspace symbols (`Ctrl+P` + `#`)
  * Works only for project files of the solution
  * Works only when the **active** editor has open a solution file (*.sln)
* Code completion for configuration (properties and values)
  * `Debug|ARM64`, `Debug|ARM`
  * `Release|ARM64`, `Release|ARM`

Improvements:

* Syntax highlight for lowercase GUIDs
* Right-hand numbers under `GlobalSection(SharedMSBuildProjectFiles)` are now highlighted as variables
* Entries under `ProjectConfigurationPlatforms` are now better highlighted
  * e.g. "Debug|x86" was two separate words, now it is only one word
  * e.g. ".Debug|x64.ActiveCfg" was three separate words, now it is only one word
* Keywords are now only shown in the code completion when usage is allowed
  * Also when the line starts with `ProjectSection` or `GlobalSection`
  * Trigger character is `(`
* Project types (GUIDs) are now only shown in the code completion when usage is allowed
  * Also when the line starts with `Project`
  * Trigger character is `(`
* Modules are now only shown in the code completion when usage is allowed
  * `Project` and `Global` only on root
  * `ProjectSection`and `EndProject` only under `Project`
  * `GlobalSection` and `EndGlobal` only under `Global`
  * `EndProjectSection` only under `ProjectSection`
  * `EndGlobalSection` only under `GlobalSection`
* Project types (GUIDs) now automatically surrounded with `"{` and `}"` instead of `{` and `}`
* Configurations, like `Debug|x64` are now only shown in the code completion when usage is allowed
  * Properties only inside `GlobalSection(SolutionConfigurationPlatforms)`
  * Values inside `GlobalSection(SolutionConfigurationPlatforms)` and `GlobalSection(ProjectConfigurationPlatforms)`
* Properties now only shown in the code completion when usage is allowed
  * `HideSolutionNode` in `GlobalSection(SolutionProperties)`
  * `SolutionGuid` and in `GlobalSection(ExtensibilityGlobals)`
* Used projects (GUIDs) now only shown in the code completion when usage is allowed
  * Only inside `GlobalSection(NestedProjects)`
  * `GlobalSection(ProjectConfigurationPlatforms)`
  * and `ProjectSection(SolutionItems)`
* Code completion for `preProject` and `postProject` now only shown on `ProjectSection` lines
  * Trigger character is `=`, space before is also automatically added
* Code completion for `preSolution` and `postSolution` now only shown on `GlobalSection` lines
  * Trigger character is `=`, space before is also automatically added
* Code completion for configuration (properties and values)
  * `Debug|Any CPU` instead of `Debug|Any`
  * `Release|Any CPU` instead of `Release|Any`

Changes:

* #49 - GUIDs from projects without `EndProject` entry produce no longer a error
  * We show now a extra error for missing `EndProject`
* Lowercase project GUIDs under `GlobalSection(SharedMSBuildProjectFiles)` produces no longer a info
* The trigger character `"` is no longer working for project types (GUIDs)
  * because of improved code completion

Fixes:

* Problems window was not clear after close a solution file.
* #35 - Fix wrong syntax highlight for words in paths
  * e.g. "Debug" was found in "Debug.cmd"
  * e.g. "Debug" was found in "CodeAnalysis.Debugging"

## [1.6.0]

New:

* #46 - Highlight all occurrences of a symbol in a document (for GUIDs)
* #42 - Goto definition of a symbol (via `F12` or context-menu)
* #50 - Goto implementation of a symbol (via `Ctrl+F12` or context-menu)
* #48 - Goto reference of a symbol (via `Shift+F12` or context-menu)
* #48 - Find all references of a symbol (via `Shift+Alt+F12` or context-menu)
* #38 - Show all symbol definitions within a document (via `Ctrl+P` + `@`)
* #38 - Show Breadcrumbs
* #51 - File link support. (Ctrl+Click to open)

Remove:

* Don't longer show file (+action) in CodeLens, replaced by file link support

## [1.5.0]

New:

* #37 - Open project file and project folder from CodeLens on project lines
* #25 - Check files paths of solution items under `ProjectSection(SolutionItems)`
* #10 - Check use configurations under `GlobalSection(ProjectConfigurationPlatforms)`
  * They must defined in `GlobalSection(SolutionConfiguration)`

Improvements:

* #32 - Show warning when project path have a extension, but it is a solution folder
* #28 - Show more useful warning message for more times nested projects

Changes:

* #30 - Found project GUIDs in lower case are now a info instead of an error
* Rename `Project type` to `Type` to save space in CodeLens line on projects
* Remove leftover from vsCode beginners extension example

Fixes:

* #28 - Show warning for all lines with more times nested projects
* #33 - Project path that start with a ".." have no syntax highlight

## [1.4.0]

New:

* #31 - CodeLens on project lines for "Project" nested in "Project"
* #2 - Show error for project GUIDs that used by another projects
* #9 - Show error for unknown project type GUIDs
* #3 - Show warning for project names that used by another projects
* #27 - Show warning when module words have not correct PascalCase
  * For `Project`, `EndProject`, `ProjectSection`, `EndProjectSection`
  * And `Global`, `EndGlobal`, `GlobalSection`, `EndGlobalSection`
* Show info for solution folders, when name is used by another projects

Improvements:

* #29 - Check file extension `.vcxitems` too (should be `C++` project)
* #20 - Code completion and syntax highlight for keyword `SharedMSBuildProjectFiles`
* Show the line number of the other usage in the diagnostic tooltip in nested project definition

Changes:

* CodeLens on project lines show no "Project type ..." instead of type only
* don't longer underline between file name and file extension
  * Make simultaneously warnings from file name and file extension more clear
* Internal: reduce diagnostic loops

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

* Clink on CodeLens of a project GUID jump to project line
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

* More fixes for file trigger was not set to `*.sln` files
* Remove not working `changlog.md` link in `redme.md` (`vsCode` and marketplace)

## [1.0.2]

Fixes:

* Fix file trigger was not set to `*.sln` files
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
