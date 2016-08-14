browserSync  = require('browser-sync')
config       = require('../../../server/_config/app')
gulp         = require('gulp')
sass         = require('gulp-sass')
sourcemaps   = require('gulp-sourcemaps')
sassGlob     = require('gulp-sass-glob')
autoprefixer = require('gulp-autoprefixer')
changed     = require('gulp-changed')
cache = require("gulp-cache-money")({
  cacheFile: __dirname + "/.cache"
})

# COMPILE MAIN SASS FILE
gulp.task 'compile:sass', ['vet:sass'], ->
  gulp.src(config.gulp.src.assets.sassMain)
    .pipe(changed(config.gulp.dest.assets.sass))
    .pipe(cache())
    .pipe(sassGlob())
    .pipe(sourcemaps.init())
      .pipe(sass()).on('error', sass.logError)
      .pipe(autoprefixer())
      .pipe(browserSync.stream())
    .pipe(sourcemaps.write('.'))
    .pipe gulp.dest(config.gulp.dest.assets.sass)
