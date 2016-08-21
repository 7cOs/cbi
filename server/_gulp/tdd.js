(function() {
  'use strict';
  var Server, gulp, path;
  gulp = require('gulp');
  Server = require('karma').Server;
  path = require('path');

  module.exports = gulp.task('tdd', function(done) {
    new Server({
      configFile: path.join(__dirname, '../..', 'karma.conf.js')
    }, done).start();
  });

}).call(this);
