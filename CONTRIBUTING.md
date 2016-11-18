# Contributing
Make sure the `grunt` command doesn't error and it's all good in the hood :)

### Setting up development

```bash
git clone git@github.com:michaeldegroot/console-debug.git
cd console-debug
npm install -g yarn grunt
yarn
````

**Alright!** Dev env is setup. Now what can we do??

### Project structure
#### main.js
*Console-debug's entry point file*
#### libs/
*Holds all important module code that console-debug works with*
##### libs/errorstack.js
*Contains code on how to work with stacktraces*
##### libs/render.js
*Contains code on how to render stacktraces*
##### libs/util.js
*Contains code that is considered to be re-used trough out the project in serveral modules*
#### styles/
*A folder that holds the theme code*
##### styles/loader.js
*This file can load themes*
##### styles/src
*This folder contains all the availible themes*
#### test/
*Contains test files/folders*
##### test/coverage
*Contains the coverage report and instrument files*
##### test/tests
*Contains the actual test files*

### Testing
in the folder `test` you will see the mocha test units

*Running these tests can be done with `grunt mocha`*

### Linting
To make sure the whole projects follows the same code style, there is a `.eslintrc` file in place.

To run the linting test run: `grunt lint`


*It's important to note that on every commit the package `pre-commit` executes a `grunt verifyCommit` and disallows the commit if either failed!*


### Coverage
Coverage is enforced to a preset value. Everytime you try to commit it will check if you exceed the thresholds

Generally it's nice to keep the coverage at the same percentage that it was before your pull request, however; if you failed to provide this I can take a look at it and try to work something out.

To run a coverage test run: `grunt verifyCoverage`

### Forcing a commit
If you really really really **really** want to submit a pull request but your commit failed because the test didn't pass you can enforce the commit with:

`git commit -n (or --no-verify)`

*this is not recommended unless you have a good reason for it :)*

### Shortcut
You can always quickly access a test when typing `grunt` it will default to a `grunt verifyCommit` command

### Watcher
Executing `grunt dev` will execute `grunt verifyCommit` and then keep watching for file changes. When it has detected a file change it will re-run `grunt verifyCommit`
