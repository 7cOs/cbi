# Compass Web Portal
This project contains code for the Compass Web Portal application. It includes the frontend code (Angular) and build toolchain (webpack), as well as a hosting and API proxy application server (Express). It makes use of the Node.js and Node Package Manager (npm) ecosystem.  
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Compile and Run](#compile-and-run)
- [NPM Tasks](#npm-tasks)
- [IDEs](#ides)
- [Testing](#testing)
- [Style Guide](#style-guide)

## Prerequisites
1. Install [Node.js](https://docs.npmjs.com/getting-started/installing-node)  
It is recommended that you use a version at least as new as specified in the `engines` section of [package.json](../blob/develop/package.json) for parity with the [CI environment](https://circleci.com/gh/ConstellationBrands/app-orion) and the [deployment environment](https://dashboard.heroku.com/pipelines/30ba816e-b652-4ca7-aed5-4a95a884d086)  
( As of this writing, use Node version **7.7.1** or newer to at least match Heroku/CircleCI )  

## Installation
1. Clone the app-orion repo: `git clone git@github.com:ConstellationBrands/app-orion.git`
2. Change into the app-orion directory that you just cloned (`cd app-orion`)
3. Install build dependencies: `npm install`

## Compile and Run
- To get started quickly, run the following command: `npm run dev`
- This will compile the frontend using webpack (watching for changes) and start the Node Express server (using nodemon to watch for changes).  
- Point your browser to [http://localhost:1980](http://localhost:1980) to hit the Express server and load the application 

### NPM Tasks
NPM's built in [task runner](https://docs.npmjs.com/cli/run-script) is used for executing build tasks and starting up the development server. Use these commands to initiate various parts of the build process.

- `npm run dev`: Compile the frontend using webpack (watching for changes) and start the Node Express server (using nodemon to watch for changes). Generally use this for day-to-day development.  
- `npm run clean`: Remove the `public` directory (all compiled/bundled assets generated by webpack)
- `npm run lint:ts`: Perform linting of all TypeScript code in the app (Note: this is run as part of the CI process)
- `npm run lint:js`: Perform linting of all JavaScript code in the app (both client, server, and tests) (Note: this is run as part of the CI process)
- `npm run lint:sass`: Perform linting of all SASS files in the app (Note: this is run as part of the CI process)
- `npm run lint`: Perform linting of TypeScript, JavaScript and SASS serially.
- `npm run build:prod`: Compile the frontend using webpack. Optimize for a production release (annotate Angular 1 code, uglify JS, and minify CSS).
- `npm run build:dev`: Compile the frontend using webpack, without performing any optimizations.
- `npm run build:dev:watch`: Compile the frontend using webpack, without performing any optimizations, and continue to watch for changes (incrementally recompile based on changed files).
- `npm run build`: An alias for `npm run build:dev:watch`
- `npm test`: Use Karma to run unit tests and report test coverage. (Note that Karma uses webpack to construct test bundles)
- `npm run test:watch`: Use Karma to run unit tests and report test coverage, while watching for changes to tests and actual code, and rebuilding/re-running tests when changes are detected.
- `npm start`: Start the Node Express server only. Useful for running the server (very very quickly) *after* performing a `build` (or similar) step.
- `npm run serve`: Start the Node Express server only (using nodemon to watch for changes and reload Node if server code is updated). Useful for running the server (very very quickly) *after* performing a `build` (or similar) step.
- `npm run heroku-postbuild`: Alias for `npm run build:prod`. Heroku looks for, recognizes, and runs this command as its final step after a new code deployment.
- `npm run fontgen`: Use `fontmin` utility to generate web-compatible font set from app/assets/fontsrc into app/assets/fonts - Generally only needed when updating/adding new source font files.

## IDEs

### Atom
If you're using Atom, you can add these packages:
- [Editorconfig](https://atom.io/packages/editorconfig): `apm install editorconfig`
- [Linter](https://atom.io/packages/linter): `apm install linter`
  - [Sass Linter](https://atom.io/packages/linter-sass-lint): `apm install linter-sass-lint`
  - [ESLint](https://atom.io/packages/linter-eslint): `apm install linter-eslint`
  - [TSLint](https://atom.io/packages/linter-tslint): `apm install linter-tslint`  

There are likely additional packages to help with TypeScript, Pug, Angular, Node, Jasmine, etc.

### IntelliJ IDEA
 - Make sure you have the `EditorConfig` plugin installed to support the predefined style conventions, in Preferences > Plugins > EditorConfig
 - It is probably also helpful to make sure these framework plugins are installed, for detection and support: AngularJS, NodeJS, Pug, SASS  

## Testing

### ievms  
The ievms (IE VMs) project can be used to obtain free virtual machine images used to run Microsoft Windows with the Internet Explorer browser. This is helpful for developing and dev-testing with various different IE browser versions, particularly IE11 (the primary supported desktop browser for this project). These VMs run in [Virtualbox](https://www.virtualbox.org/), which can be freely obtained for a variety of operating systems.  
https://github.com/xdissent/ievms  

## Style Guide
The Compass Web portal has a built-in style guide view, which is available locally (or on QA), and can be browsed to manually:  
[http://localhost:1980/style-guide](http://localhost:1980/style-guide) 
