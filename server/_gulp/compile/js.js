(function() {
  var babelify, browserifyInc, config, fs, gulp;
  babelify = require('babelify');
  browserifyInc = require('browserify-incremental');
  config = require('../../../server/_config/app');
  fs = require('graceful-fs');
  gulp = require('gulp');

  gulp.task('compile:js', ['vet:js'], function() {
    return browserifyInc({
      debug: true,
      cacheFile: __dirname + '/cache/.browserify-cache.json'
    }).transform(babelify.configure({
      presets: 'es2015'
    })).require(config.gulp.src.assets.jsMain, {
      entry: true
    }).bundle().pipe(fs.createWriteStream(config.gulp.dest.assets.jsMain));
  });

}).call(this);
