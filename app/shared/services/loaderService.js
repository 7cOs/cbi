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

    /**
     * @name openLoader
     * @desc Display beer glass loader
     * @params {String} disableScroll - Optionally disable page scroll (for full-page overlay loader)
     * @memberOf cf.common.services
     */
    function openLoader(disableScroll) {
      model.loadingFilters = true;
      if (disableScroll) {
        scrollService.disableScroll();
        model.scrollDisabled = true;
      }
    }

    /**
     * @name closeLoader
     * @desc Close beer glass loader
     * @memberOf cf.common.services
     */
    function closeLoader() {
      model.loadingFilters = false;
      if (model.scrollDisabled) {
        scrollService.enableScroll();
      }
    }
  };
