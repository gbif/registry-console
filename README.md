[![Build Status](https://travis-ci.org/gbif/registry-console.svg?branch=bug-fix)](https://travis-ci.org/gbif/registry-console)

# A frontend to display and manage the GBIF registry

# Cypress
For end to end testing there is cypress. The visual runner can be used with.
`./node_modules/.bin/cypress open --env adminUsername=adminUsername,adminPassword=adminPassword`
For running the tests without the interface, then `node node_modules/cypress/bin/cypress run --env adminUsername=adminUsername,adminPassword=adminPassword`

----------

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm install`

First you should install the the required dependencies. The project is known to work with Node v.16.12.0. You can use nvm to manage which version of Node you are running

### `npm start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.<br>
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (Webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

### Local environment
The app uses several environment variables which could be customised on your local machine:
* `REACT_APP_URL` - App url, default value is `https://www.gbif-dev.org`
* `REACT_APP_API` - API url, default value for demo/dev environment is `https://registry-api.gbif-dev.org`
* `REACT_APP_API_V1` - API V1 url, default value is `https://api.gbif-dev.org/v1`
* `REACT_APP_VERSION` - App version in package.json file (field `version`), default value is `undefined` (production value is `$npm_package_version`). Version can be increased by running e.g. `npm version patch`.

To customise variables you should create a locale file in a root of the project with a name `.env.local` and add variables in the format `KEY=VALUE`. 
Each variable should be on a separate line.
Your local file will be ignored by Git.

### Add a language to an environment
Once a translation is ready in [Crowdin](https://crowdin.com/project/gbif-registry/) and should be added to e.g. production, then we need to update the configuration.

Which languages are avialable in which environments is defined in [/src/api/util/config.js](https://github.com/gbif/registry-console/blob/master/src/api/util/config.js#L15)
E.g. https://github.com/gbif/registry-console/blob/da4b31fc79e5124d6f552abb525d06c80cd2b677/src/api/util/config.js#L15

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
