
(function() {
  var cache, changed, config, gulp, imagemin;
  config = require('../../../server/_config/app');
  imagemin = require('gulp-imagemin');
  gulp = require('gulp');
  changed = require('gulp-changed');
  cache = require('gulp-cache-money')({
    cacheFile: __dirname + '/cache/.cache-money'
  });

  gulp.task('compile:img', function() {
    return gulp.src(config.gulp.src.assets.img).pipe(changed(config.gulp.dest.assets.img)).pipe(cache()).pipe(imagemin()).pipe(gulp.dest(config.gulp.dest.assets.img));
  });

}).call(this);
