'use strict';

module.exports =
  angular.module('cf.common.filters', [])
  .filter('titlecase', require('./titlecase'))
  .filter('zipcode', require('./zipcode'))
  .filter('timeAgo', require('./timeAgo'))
  .filter('formatOpportunitiesType', require('./formatOpportunitiesType'))
  .filter('truncateText', require('./truncateText'));
