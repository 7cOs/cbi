'use strict';

module.exports =
  angular.module('andromeda.common.components', [
    require('./loader').name,
    require('./navbar').name,
    require('./datepicker').name,
    require('./tabs').name,
    require('./typeahead').name,
    require('./dropdown').name
  ]);
