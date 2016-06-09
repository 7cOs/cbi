config      = require('../../server/_config/app')
del         = require('del')
gulp        = require('gulp')
runSequence = require('run-sequence')

# REQUIRE COMPILATION TASKS
require('require-dir')('./compile');

# DEFAULT TASK TO COMPILE & THEN LAUNCH SERVER
gulp.task 'default', ->
  runSequence [
    'ts-files'
    'copy:libs'
    'compile'
    'serve'
  ],

# COMPILE ALL THE THINGZ
gulp.task 'compile', ->
  runSequence [
    'compile:pug'
    'compile:js'
    'compile:sass'
    'compile:ts'
  ]

# CLEAN UP BEFORE BUILDS
gulp.task 'clean', ->
  del 'dist/**/*'
