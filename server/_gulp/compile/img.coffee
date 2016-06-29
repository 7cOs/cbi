config      = require('../../../server/_config/app')
imagemin    = require('gulp-imagemin')
gulp        = require('gulp')

# PROCESS IMAGES
gulp.task 'compile:img', ->
  gulp.src(config.gulp.src.assets.img)
      .pipe(imagemin())
      .pipe(gulp.dest(config.gulp.dest.assets.img))
