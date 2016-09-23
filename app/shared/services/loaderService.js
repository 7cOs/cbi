'use strict';

module.exports = /*  @ngInject */
  function loaderService(scrollService) {

    var model = {
      loadingFilters: false,
      scrollDisabled: false
    };

    var service = {
      model: model,
      openLoader: openLoader,
      closeLoader: closeLoader
    };

    return service;

    function openLoader(disableScroll) {
      model.loadingFilters = true;
      if (disableScroll) {
        scrollService.disableScroll();
        model.scrollDisabled = true;
      }
    }

    function closeLoader() {
      model.loadingFilters = false;
      if (model.scrollDisabled) {
        scrollService.enableScroll();
      }
    }
  };
