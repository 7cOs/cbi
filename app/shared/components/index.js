'use strict';

module.exports =
  angular.module('andromeda.common.components', [
    require('./loader').name,
    require('./datepicker').name,
    require('./tabs').name,
    require('./typeahead').name
  ]);
