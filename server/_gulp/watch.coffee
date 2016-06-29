config      = require('../../server/_config/app')
gulp        = require('gulp')
runSequence = require('run-sequence')

# WATCH ASSETS FOR CHANGES
gulp.task 'watch', ->

  gulp.watch config.gulp.src.assets.sass, ->
    runSequence 'compile:sass'

  gulp.watch config.gulp.src.assets.angular.css, ->
    runSequence 'compile:sass', 'reload'

  gulp.watch config.gulp.src.assets.js, ->
    runSequence 'compile:js', 'reload'

  gulp.watch config.gulp.src.assets.pug.templates, ->
    runSequence 'compile:pug', 'reload'

  gulp.watch config.gulp.src.assets.img, ->
    runSequence 'compile:img', 'reload'

  gulp.watch config.gulp.src.assets.ts, ->
    runSequence 'ts-files', 'compile:ts', 'reload'
