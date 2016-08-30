'use strict';

module.exports =
  angular.module('cf.common.directives', [])
    .directive('customChip', require('./customChip'))
    .directive('clPaging', require('./cl-paging/index'))
    .directive('inlineSearch', require('./inline-search/index'));
