'use strict'
gulp = require('gulp')
Server = require('karma').Server
path = require('path')
module.exports = gulp.task('tdd', (done) ->
  new Server({ configFile: path.join(__dirname, '../..', 'karma.conf.js') }, done).start()
  return
)
