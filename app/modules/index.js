'use strict';

module.exports =
  angular.module('cf.modules', [
    require('./landing').name,
    require('./accounts').name,
    require('./opportunities').name,
    require('./scorecards').name,
    require('./target-lists').name,
    require('./target-list-detail').name,
    require('./style-guide').name,
    require('./help').name,
    require('./lists').name
  ]);
