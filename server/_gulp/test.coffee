'use strict'
gulp = require('gulp')
Server = require('karma').Server
path = require('path')
module.exports = gulp.task('test', (done) ->
  new Server({ configFile: path.join(__dirname, '../..', 'karma.conf.js'), singleRun: true}, done).start()
  return
)
