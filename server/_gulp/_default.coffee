config      = require('../../server/_config/app')
del         = require('del')
gulp        = require('gulp')
argv = require('yargs').argv
runSequence = require('run-sequence')

# --release flag when executing a task
global.release = argv.release

# REQUIRE COMPILATION TASKS
require('require-dir')('./compile');

# DEFAULT TASK TO COMPILE & THEN LAUNCH SERVER
if release
  gulp.task 'default', ->
    runSequence [
      'compile'
      'serve'
    ],
else
  gulp.task 'default', ->
    runSequence [
      'compile'
      'serve'
      'karma'
    ],

# COMPILE ALL THE THINGZ
gulp.task 'compile', ->
  runSequence [
    'compile:pug'
    'compile:js'
    'compile:sass'
    'compile:img'
  ]

# CLEAN UP BEFORE BUILDS
gulp.task 'clean', ->
  del 'public/**/*'
