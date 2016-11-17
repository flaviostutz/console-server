# Contributing
Make sure `npm run test` doesn't error and it's all good in the hood :)

### Setting up development

```bash
git clone git@github.com:michaeldegroot/console-debug.git
cd console-debug
npm install -g yarn
yarn
````

**Alright!** Dev env is setup. Now what can we do??

### Testing
in the folder `test` you will see the mocha test units

*Running these tests can be done with `npm run mocha`*

### Linting
To make sure the whole projects follows the same code style, there is a `.eslintrc` file in place.

To run the linting test run: `npm run lint`


*It's important to note that on every commit the package `pre-commit` executes a `npm run lint` and a `npm run test` and disallows the commit if either failed!*


### Coverage
Generally it's nice to keep the coverage at the same percentage that it was before your pull request, however; if you failed to provide this I can take a look at it and try to work something out.

To run a coverage test run: `npm run cover`
