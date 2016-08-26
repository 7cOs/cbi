'use strict';

module.exports =
  angular.module('cf.common', [
    require('./components').name,
    require('./directives').name,
    require('./filters').name,
    require('./services').name
  ]);

