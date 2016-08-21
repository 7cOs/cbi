(function() {
  var config, gulp, nodemon, runSequence;
  config = require('../../server/_config/app');
  gulp = require('gulp');
  nodemon = require('gulp-nodemon');
  runSequence = require('run-sequence');

  gulp.task('serve', function(cb) {
    var called;
    called = false;
    return nodemon({
      script: config.dir.server.script,
      verbose: false,
      watch: ['./server/*', './public/**/*.js'],
      ignore: ['./app/*', '*.html']
    }).on('start', function() {
      if (!called) {
        runSequence(['watch', 'browserSync']);
        called = true;
        return called;
      }
    });
  });

}).call(this);
