# React Boilerplate

> Boilerplate with react + redux + react-router4 + webpack4

## Installation
```bash
$ git clone https://github.com/gcfeng/react-boilerplate.git
$ cp react-boilerplate/<template-name>/* <my-project-name>
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
| `format`| format code with prettier |
| `server`| start dev server serve files after build |
| `test`  | run tests |
| `build` | build project and output to `dist/` |
| `build:dll:dev` | build development dll |
| `build:dll:prod`| build production dll |

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
          |- PageA.js             # PageA's component
          |- PageAContainer.js    # PageA's container
          |- model.js             # PageA's redux model  
          |- index.js             # PageA's entry
        |- PageB
    |- models                     # Global Redux models
    |- services                   # Handle module service logic
    |- utils                      # Utility methods
    |- styles                     # Global styles
      |- assets                   # Global assets, such as images
    |- store.js                   # Redux store
    |- index.js                   # Entry
```
