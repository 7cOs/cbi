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
    .factory('productService', require('./productService'))
    .factory('userService', require('./userService'));
