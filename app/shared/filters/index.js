'use strict';

module.exports =
  angular.module('cf.common.filters', [])
  .filter('titlecase', require('./titlecase'))
  .filter('timeAgo', require('./timeAgo'))
  .filter('formatOpportunitiesType', require('./formatOpportunitiesType'));
