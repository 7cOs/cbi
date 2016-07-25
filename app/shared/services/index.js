'use strict';

module.exports =
  angular.module('andromeda.common.services', [])
    .factory('myperformanceService', require('./myperformanceService'))
    .factory('opportunitiesService', require('./opportunitiesService'))
    .factory('notificationsService', require('./notificationsService'))
    .factory('searchService', require('./searchService'))
    .factory('storesService', require('./storesService'))
    .factory('targetListService', require('./targetListService'))
    .factory('userNotesService', require('./userNotesService'))
    .factory('productsService', require('./productsService'))
    .factory('distributorsService', require('./distributorsService'))
    .factory('userService', require('./userService'))
    .factory('apiHelperService', require('./apiHelperService'))
    .factory('filtersService', require('./filtersService'))
    .factory('opportunityFiltersService', require('./opportunityFiltersService'))
    .factory('chipsService', require('./chipsService'));
