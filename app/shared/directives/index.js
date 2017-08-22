'use strict';

module.exports =
  angular.module('cf.common.directives', [])
    .directive('analyticsEventOn', require('./analytics-event'))
    .directive('customChip', require('./customChip'))
    .directive('longNote', require('./longNote'))
    .directive('imageLoader', require('./imageLoader'))
    .directive('clPaging', require('./cl-paging/index'))
    .directive('inlineSearch', require('./inline-search/index'))
    .controller('InlineSearchController', require('./inline-search/inlineSearchController'));

