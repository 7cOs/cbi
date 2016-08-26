'use strict';

module.exports =
  angular.module('cf.common.directives', [])
    .directive('customChip', require('./customChip'))
    .directive('inlineSearch', require('./inline-search/index'));
