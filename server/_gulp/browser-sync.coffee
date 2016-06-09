browserSync = require('browser-sync')
config      = require('../../server/_config/app')
gulp        = require('gulp')
reload      = browserSync.reload

# WATCH FOR CHANGES WITH BROWSER SYNC
gulp.task 'browserSync', ->
# browserSyncStart = ->
  browserSync.init null,
    # files: config.gulp.browserSync.files
    open: config.gulp.browserSync.open
    port: config.gulp.browserSync.port
    proxy: 'http://localhost:' + config.port
    reloadDelay: config.gulp.browserSync.reloadDelay
    ws: config.socket
    # watchOptions:
    #   ignoreInitial: true
    #   ignored: config.gulp.browserSync.ignore

# RELOAD BROWSERS ON CHANGE
gulp.task 'reload', ->
  reload()
