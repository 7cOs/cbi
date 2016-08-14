config      = require('../../../server/_config/app')
imagemin    = require('gulp-imagemin')
gulp        = require('gulp')
changed     = require('gulp-changed')
cache = require("gulp-cache-money")({
  cacheFile: __dirname + "/.cache"
})

# PROCESS IMAGES
gulp.task 'compile:img', ->
  gulp.src(config.gulp.src.assets.img)
      .pipe(changed(config.gulp.dest.assets.img))
      .pipe(cache())
      .pipe(imagemin())
      .pipe(gulp.dest(config.gulp.dest.assets.img))
