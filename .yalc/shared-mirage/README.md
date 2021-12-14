# Fastly Shared Mirage Configuration
This repository is meant to contain mirage configurations that can be 
shared across multiple repositories.  This should ensure a consistent
mock API for use across multiple front-end projects.

The project is built using the Mirage JS Mock API framework.  When it is
running within a front-end project, it will intercept each `XMLHttpRequest` 
or `fetch` request and match it against the configured routes.
## Installation
#### NPM
```
npm install --save-dev https://github.com/fastly/shared-mirage
```
#### Yarn
```
yarn add --dev https://github.com/fastly/shared-mirage
```
## Usage
#### Within an Ember application
After installing via yarn or npm, import the shared-mirage library into 
your Ember application:
```
app.import('node_modules/shared-mirage/dist/index.js');
```
Once it's imported, it becomes globally available and can be used within 
your Mirage settings like:
```
sharedMirage.RouteHandlers.Whistler(routeHandlerParams);
```
#### Within a React application
You can import the entire configuration module:
```
import SharedMirage from "shared-mirage";
```
Optionally, you can import only the modules you need:
```
import { Factories, RouteHandlers } from "shared-mirage"; 
```
Once it's imported, you can use it within your Mirage settings like:
```
sharedMirage.RouteHandlers.Whistler(routeHandlerParams);
```
## Scripts
Start the embedded React application for testing mirage routes:
`npm run start`

Build for use in other projects:
`npm run build`

Execute tests:
`npm run test`