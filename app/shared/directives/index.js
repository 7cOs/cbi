'use strict';

module.exports =
  angular.module('orion.common.directives', [])
    .directive('customChip', require('./customChip'))
    .directive('inlineSearch', require('./inline-search/index'));
