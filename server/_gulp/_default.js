(function() {
  var argv, del, gulp, runSequence, release;

  del = require('del');
  gulp = require('gulp');
  argv = require('yargs').argv;
  runSequence = require('run-sequence');
  release = argv.release;
  require('require-dir')('./compile');

  if (release) {
    gulp.task('default', function() {
      return runSequence(['compile:release']);
    });
  } else {
    gulp.task('default', function(cb) {
      return runSequence('compile', ['serve', 'tdd'], cb);
    });
  }

  gulp.task('compile', function(cb) {
    return runSequence(['compile:pug', 'compile:js:development', 'compile:fonts', 'compile:sass', 'compile:img'], cb);
  });

  gulp.task('compile:release', function(cb) {
    console.log('release compilation');
    return runSequence(['compile:pug', 'compile:js:production', 'compile:fonts', 'compile:sass', 'compile:img'], cb);
  });

  gulp.task('clean', function() {
    del('public/**/*');
    del('server/_gulp/compile/cache/.browserify-cache.json');
    del('server/_gulp/compile/cache/.cache-money');
  });

}).call(this);
