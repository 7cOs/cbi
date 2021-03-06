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
    .factory('closedOpportunitiesService', require('./closedOpportunitiesService'))
    .factory('versionService', require('./versionService'))
    .factory('searchService', require('./searchService'))
    .factory('scrollService', require('./scrollService'))
    .factory('usStatesService', require('./usStatesService'))
    .factory('loaderService', require('./loaderService'))
    .factory('ieHackService', require('./ieHackService'))
    .factory('toastService', require('./toastService'))
    .factory('httpInterceptorService', require('./httpInterceptorService'))
    .factory('encodingService', require('./encodingService'));
