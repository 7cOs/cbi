browserSync = require('browser-sync')
config      = require('../../../server/_config/app')
gulp        = require('gulp')
sass        = require('gulp-sass')
sourcemaps  = require('gulp-sourcemaps')

# COMPILE MAIN SASS FILE
gulp.task 'compile:sass', ['vet:sass'], ->
  gulp.src(config.gulp.src.assets.sassMain)
    .pipe(sourcemaps.init())
      .pipe(sass()).on('error', sass.logError)
      .pipe(browserSync.stream())
    .pipe(sourcemaps.write('.'))
    .pipe gulp.dest(config.gulp.dest.assets.sass)
  gulp.src(config.gulp.src.assets.angular.css)
    .pipe(sourcemaps.init())
      .pipe(sass()).on('error', sass.logError)
    .pipe(sourcemaps.write('.'))
    .pipe gulp.dest(config.gulp.dest.assets.angular.css)
