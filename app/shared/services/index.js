'use strict';

module.exports =
  angular.module('cf.common.services', [])
    .factory('myperformanceService', require('./myperformanceService'))
    .factory('opportunitiesService', require('./opportunitiesService'))
    .factory('notificationsService', require('./notificationsService'))
    .factory('storesService', require('./storesService'))
    .factory('targetListService', require('./targetListService'))
    .factory('distributorsService', require('./distributorsService'))
    .factory('userService', require('./userService'))
    .factory('apiHelperService', require('./apiHelperService'))
    .factory('filtersService', require('./filtersService'))
    .factory('opportunityFiltersService', require('./opportunityFiltersService'))
    .factory('notesService', require('./notesService'))
    .factory('chipsService', require('./chipsService'))
    .factory('closedOpportunities', require('./closedOpportunitiesService'))
    .factory('searchService', require('./searchService'));
