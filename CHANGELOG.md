# Change Log

All notable changes to the "solutionextension" extension will be documented in this file.

Check [Keep a Changelog](http://keepachangelog.com/) for recommendations on how to structure this file.

## [1.0.3]

Fixes:

* More fixes for file trigger was not set to "*.sln" files.
* Remove not working changlog.md link in redme.md (vscode and marketplace)

## [1.0.2]

Fixes:

* Fix file trigger was not set to "*.sln" files.
* Fix not wrong link to changelog file

## [1.0.1]

Fixes:

* Fix not wrong picture link in readme
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
