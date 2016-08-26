(function() {
  var config, eslint, gulp, sassLint;
  config = require('../../server/_config/app');
  gulp = require('gulp');
  eslint = require('gulp-eslint');
  sassLint = require('gulp-sass-lint');

  gulp.task('vet:js', function() {
    var jsPath;
    jsPath = config.gulp.src.assets.js;
    jsPath.push('./server/**/*.js');
    jsPath.push('./config/**/*.js');
    jsPath.push('./server.js');
    return gulp.src(jsPath).pipe(eslint()).pipe(eslint.format()).pipe(eslint.failAfterError());
  });

  gulp.task('vet:sass', function() {
    var sassPath;
    sassPath = config.gulp.src.assets.sassLint;
    return gulp.src(sassPath).pipe(sassLint()).pipe(sassLint.format()).pipe(sassLint.failOnError());
  });

}).call(this);
