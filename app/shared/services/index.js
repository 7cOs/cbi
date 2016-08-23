'use strict';

module.exports =
  angular.module('orion.common.services', [])
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
    .factory('searchService', require('./searchService'));
