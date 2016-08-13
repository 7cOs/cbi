'use strict';

module.exports =
  angular.module('orion.common.components', [
    require('./loader').name,
    require('./navbar').name,
    require('./datepicker').name,
    require('./tabs').name,
    require('./typeahead').name,
    require('./dropdown').name,
    require('./list').name,
    require('./target').name,
    require('./target-list-expanded').name,
    require('./list-demo').name,
    require('./notes').name
  ]);
