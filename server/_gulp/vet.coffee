config      = require('../../server/_config/app')
gulp        = require('gulp')
eslint      = require('gulp-eslint')
sassLint    = require('gulp-sass-lint')

# LINT JAVASCRIPT
gulp.task 'vet:js', ->
  jsPath = config.gulp.src.assets.js
  jsPath.push('./server/**/*.js')
  jsPath.push('./config/**/*.js')
  jsPath.push('./server.js')
  return gulp.src(jsPath)
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError())

# LINT SASS
gulp.task 'vet:sass', ->
  sassPath = config.gulp.src.assets.sass
  return gulp.src(sassPath)
    .pipe(sassLint())
    .pipe(sassLint.format())
    .pipe(sassLint.failOnError())
