(function() {
  var config, gulp, runSequence;
  config = require('../../server/_config/app');
  gulp = require('gulp');
  runSequence = require('run-sequence');

  gulp.task('watch', function() {
    gulp.watch(config.gulp.src.assets.sass, function() {
      return runSequence('compile:sass');
    });
    gulp.watch(config.gulp.src.assets.angular.css, function() {
      return runSequence('compile:sass', 'reload');
    });
    gulp.watch(config.gulp.src.assets.js, function() {
      return runSequence('compile:js', 'reload');
    });
    gulp.watch(config.gulp.src.assets.pug.templates, function() {
      return runSequence('compile:pug', 'reload');
    });
    return gulp.watch(config.gulp.src.assets.img, function() {
      return runSequence('compile:img', 'reload');
    });
  });

}).call(this);
