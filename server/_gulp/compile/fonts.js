(function() {
  var cache, config, gulp, fontmin;
  config = require('../../../server/_config/app');
  gulp = require('gulp');
  cache = require('gulp-cache-money')({
    cacheFile: __dirname + '/cache/.cache-money'
  });
  fontmin = require('gulp-fontmin');

  gulp.task('compile:fonts', function() {
    return gulp.src(config.gulp.src.assets.fonts)
      .pipe(fontmin())
      .pipe(cache())
      .pipe(gulp.dest(config.gulp.dest.assets.fonts));
  });

}).call(this);
