config      = require('../../../server/_config/app')
gulp        = require('gulp')
cache = require("gulp-cache-money")({
  cacheFile: __dirname + "/.cache"
})

# PROCESS IMAGES
gulp.task 'compile:fonts', ->
  gulp.src(config.gulp.src.assets.fonts)
      .pipe(cache())
      .pipe(gulp.dest(config.gulp.dest.assets.fonts))
