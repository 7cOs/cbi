'use strict';

module.exports =
  angular.module('andromeda.common.filters', [])
  .filter('titlecase', require('./titlecase'))
  .filter('timeAgo', require('./timeAgo'));
