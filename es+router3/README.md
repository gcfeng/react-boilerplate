# React Template

> A template with react + redux + react-router3 + webpack4

## Installation
```bash
$ git clone https://github.com/gcfeng/react-template.git
$ cp react-template/<template-name>/* <my-project-name>
$ cd <my-project-name>
$ npm install
```

## Running the project
After completing the [installation](#installation) step, you are ready to start the project!
```bash
$ npm start # Start the development server
```

All available commands:

| `npm run <script>` | Description |
|--------------------|-------------|
| `start` | start dev server, default listen to 8080, support HRM |
| `start:prod` | start dev server serve files after build |
| `build:dev:dll` | build development dll |
| `build:prod:dll` | build production dll |
| `build:prod` | build project and output to `dist/` |

## Project structure
```
|- config                         # Project config
|- public                         # Static files will be copied to dist/
|- src
    |- components                 # Components
    |- routes                     # Pages
        |- PageA
          |- __tests__
          |- assets               # Images, fonts and so on
          |- components           # PageA's components
          |- containers           # PageA's containers
          |- models               # PageA's redux models
          |- index.js             # PageA's entry
        |- PageB
    |- models                     # Redux models
    |- services                   # Handle module service logic
    |- utils                      # Utility methods
    |- styles                     # Global styles
      |- assets                   # Global assets, such as images
    |- store.js                   # Redux store
    |- index.js                   # Entry
```
