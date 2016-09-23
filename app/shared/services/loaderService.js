'use strict';

module.exports = /*  @ngInject */
  function loaderService(scrollService) {

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
      model.loadingFilters = true;
      scrollService.disableScroll();
    }

    function closeLoader() {
      model.loadingFilters = false;
      scrollService.enableScroll();
    }
  };
