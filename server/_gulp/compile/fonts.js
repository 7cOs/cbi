(function() {
  var cache, config, gulp;
  config = require('../../../server/_config/app');
  gulp = require('gulp');
  cache = require('gulp-cache-money')({
    cacheFile: __dirname + '/cache/.cache-money'
  });

  gulp.task('compile:fonts', function() {
    return gulp.src(config.gulp.src.assets.fonts).pipe(cache()).pipe(gulp.dest(config.gulp.dest.assets.fonts));
  });

}).call(this);
