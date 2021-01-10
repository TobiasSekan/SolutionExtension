# solutionextension README

VScode extension for Visual Studio solution files (*.sln)

![picture](https://github.com/TobiasSekan/SolutionExtension/blob/docs/readme.png)

## Features

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

## Known Issues

* only a few keywords have tooltips, because the official documentation doesn't contain more information.

## Missing a feature or found a bug?

* Please open a **new issues** under the [SolutionExtension](https://github.com/TobiasSekan/SolutionExtension/issues) repository

## Release Notes

### 1.0.0

Initial release
