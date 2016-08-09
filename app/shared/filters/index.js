'use strict';

module.exports =
  angular.module('orion.common.filters', [])
  .filter('titlecase', require('./titlecase'))
  .filter('timeAgo', require('./timeAgo'));
