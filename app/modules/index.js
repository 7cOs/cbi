module.exports =
  angular.module('andromeda.modules', [
    require('./accounts').name,
    require('./opportunities').name,
    require('./scorecards').name,
    require('./target-lists').name
  ]);

