# Node.js + Angular 2 Seed

Built on top of Express. Includes a simple configuration file, to easily turn features & customize settings.

Out of the box you get:
- Angular 2
- Typescript
- Socket.io
- Redis
- Authentication (with Passport.js or Apache style htpasswd)
- Jade
- Sass
- Gulp build process with:
  - Babel + Browserify
  - Browsersync + Livereload
  - Linting w/ ES Lint + Sass Lint

### Prerequisites
- [Install Node.js](https://docs.npmjs.com/getting-started/installing-node)
- Install Typings `npm install -g typings`

### To Use
Simple clone the repo and run `npm install` to install dependencies. Then run `gulp` to start the server and point your browser to [http://localhost:3000](http://localhost:3000)

#### Troubleshooting
If you run into any typescript errors, try running `typings install`
