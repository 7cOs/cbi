module.exports =
  angular.module('andromeda.modules', [
    require('./landing').name,
    require('./accounts').name,
    require('./opportunities').name,
    require('./scorecards').name,
    require('./target-lists').name,
    require('./style-guide').name
  ]);

