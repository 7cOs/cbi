(function() {
  var cache, changed, config, gulp, pug, runSequence;
  config = require('../../../server/_config/app');
  gulp = require('gulp');
  pug = require('gulp-pug');
  runSequence = require('run-sequence');
  changed = require('gulp-changed');
  cache = require('gulp-cache-money')({
    cacheFile: __dirname + '/cache/.cache-money'
  });

  gulp.task('compile:pug', function() {
    gulp.src(config.gulp.src.assets.pug.templates).pipe(changed(config.gulp.dest.assets.pug.templates)).pipe(cache()).pipe(pug({
      pretty: true,
      locals: {
        config: config
      }
    })).pipe(gulp.dest(config.gulp.dest.assets.pug.templates));
    if (process.argv.watch && !process.argv.watchJade) {
      process.argv.watchJade = true;
      return gulp.watch(config.gulp.src.assets.pug.templates, function(cb) {
        return runSequence('compile:pug', 'reload', cb);
      });
    }
  });

}).call(this);
