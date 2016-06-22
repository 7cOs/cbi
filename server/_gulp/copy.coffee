config      = require('../../server/_config/app')
gulp = require('gulp')

# COPY REQUIRED NPM PACKAGES TO LIB FOLDER
# TODO: THIS SUCKS! FIND A BETTER SOLUTION :(
gulp.task 'copy:libs', ->
  gulp
    .src([
      config.gulp.npm + '*angular/**/*'
      config.gulp.npm + '*angular-material/**/*'
    ])
    .pipe gulp.dest(config.gulp.dest.lib)
