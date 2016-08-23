(function() {
  var babelify, browserifyInc, config, fs, gulp, minifyify, ngannotate;
  babelify = require('babelify');
  browserifyInc = require('browserify-incremental');
  config = require('../../../server/_config/app');
  fs = require('graceful-fs');
  gulp = require('gulp');
  minifyify = require('minifyify');
  ngannotate = require('browserify-ngannotate');

  gulp.task('compile:js:development', ['vet:js'], function() {
    return browserifyInc({
      debug: true,
      cacheFile: __dirname + '/cache/.browserify-cache.json'
    }).transform(babelify.configure({
      presets: 'es2015'
    })).require(config.gulp.src.assets.jsMain, {
      entry: true
    })
    .bundle().pipe(fs.createWriteStream(config.gulp.dest.assets.jsMain));
  });

  gulp.task('compile:js:production', ['vet:js'], function() {
    return browserifyInc({
      debug: false
    }).transform(babelify.configure({
      presets: 'es2015'
    })).plugin(minifyify, {
      map: false,
      exclude: ['**/node_modules/textangular/**/*']
    })
    .require(config.gulp.src.assets.jsMain, {
      entry: true
    })
    .transform(ngannotate)
    .bundle().pipe(fs.createWriteStream(config.gulp.dest.assets.jsMain));
  });

}).call(this);
