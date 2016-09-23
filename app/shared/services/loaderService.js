'use strict';

module.exports = /*  @ngInject */
  function loaderService() {

    var model = {
      loadingFilters: false
    };

    var service = {
      model: model,
      openLoader: openLoader,
      closeLoader: closeLoader
    };

    return service;

    function openLoader() {
      // Set loader true
      model.loadingFilters = true;
    }

    function closeLoader() {
      // Set loader false
      model.loadingFilters = false;
    }
  };
