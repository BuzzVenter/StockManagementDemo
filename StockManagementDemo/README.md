# StockManagementDemo

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 8.0.0.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).

## Running Server

Run `npm run start:server` to run nodemon (server monitor script), for use during development of node.js



Angular Testing Fundamental Concepts
---------------------------------------------------------------
Two types of testing

1. Unit Tests - spec.ts
2. End to End Tests - .e2e-spec.ts

- Whenever you see a file ending with .spec.ts - it means this is a unit test script

- Whenever you see a file inside the folder e2e folder
    - this is the folder where you will see all the End to End test scripts
    - e3e-spec.ts

- All of our End to end test scripts will/should be inside the e2e folder

- Unit tests can be in anyt folder - in respective folders
    - The best parcatice is, keep your unit test where your code is

- Angular supports
    - Jasmin/Karma -> Unit tests
    - Protactor -> End to end tests

- We will need to configuration for running our tests
    - karma config file -> /src/karma.config.js
    - protractor config file -> protactor.conf.js

- We can make configurations changes for unit test and e2e tests

- We can do a lot of things w.r.t testing
    - codde converage reports
    - configuring ports
    - configuring test - skip
    - which ones to execute etc 

- We can test any and all aspects of Angular application
    - the purpose isto test "our application" logic and NOT to test Angular framework

- We can extent our Angular application to work and test with other testing frameworks 
    - Mocha
    - Cucumber

- Coverage
    - All the test report and code coverage details are captured in the folder

- Under aource you will find a file called ->
    Main.ts
        - is the starting point of our Angular application
        - AppModule is the default bootstrap module
            - this is NOT our bootstrap CSS framework
            - here the bootstrap - which module to load first when our app starts

        - We can configure which module to start when our app loads
        - Using platformBrowserDynamic we start and let Angular know which module to load

    Test.ts
        - is the file testing the code of main.ts file

    - What is the difference between main.ts and test.ts!!!!

- Some configuration our test configs
    - Angular.json
