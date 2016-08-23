(function() {
  var autoprefixer, browserSync, changed, config, gulp, sass, sassGlob, sourcemaps;
  browserSync = require('browser-sync');
  config = require('../../../server/_config/app');
  gulp = require('gulp');
  sass = require('gulp-sass');
  sourcemaps = require('gulp-sourcemaps');
  sassGlob = require('gulp-sass-glob');
  autoprefixer = require('gulp-autoprefixer');
  changed = require('gulp-changed');

  gulp.task('compile:sass', ['vet:sass'], function() {
    return gulp.src(config.gulp.src.assets.sassMain)
      .pipe(changed(config.gulp.dest.assets.sass))
      .pipe(sassGlob())
      .pipe(sourcemaps.init())
      .pipe(sass({outputStyle: 'compressed'})).on('error', sass.logError)
      .pipe(autoprefixer()).pipe(browserSync.stream())
      .pipe(sourcemaps.write('.'))
      .pipe(gulp.dest(config.gulp.dest.assets.sass));
  });

}).call(this);
