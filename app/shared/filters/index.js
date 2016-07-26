'use strict';

module.exports =
  angular.module('andromeda.common.filters', [])
  .filter('timeAgo', require('./timeAgo'));
  // .filter('filterName', require('./filterName'));
