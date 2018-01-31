'use strict';

module.exports = /*  @ngInject */
  function toastService($timeout) {

    var model = {
      archived: false,
      deleted: false,
      copied: false,
      added: false,
      deleteError: false,
      multipleTargetListsSelected: false,
      performanceDataError: false,
      opportunityCountError: false,
      reportDeleted: false,
      reportSaved: false
    };

    var service = {
      model: model,
      showToast: showToast,
      showPerformanceDataErrorToast: showPerformanceDataErrorToast,
      showOpportunityCountErrorToast: showOpportunityCountErrorToast
    };

    const threeSeconds = 3000;
    const sixSeconds = 6000;
    const tenSeconds = 10000;

    return service;

    /**
     * @name showToast
     * @desc Shows toast for target list actions
     * @params {String} targetListAction - Action taken for appropriate toast
     * @params {Array} selectedTargetLists (optional) - Currently selected list items
     * @memberOf cf.common.services
     */
    function showToast(targetListAction, selectedTargetLists) {

      if (selectedTargetLists && selectedTargetLists.length > 1) {
        model.multipleTargetListsSelected = true;
      }

      model[targetListAction] = true;

      // Reset defaults
      $timeout(function () {
        model[targetListAction] = false;
      }, threeSeconds);

      $timeout(function () {
        model.multipleTargetListsSelected = false;
      }, sixSeconds);
    }

    function showPerformanceDataErrorToast() {
      model.performanceDataError = true;

      $timeout(() => {
        model.performanceDataError = false;
      }, tenSeconds);
    }

    function showOpportunityCountErrorToast() {
      model.opportunityCountError = true;

      $timeout(() => {
        model.opportunityCountError = false;
      }, tenSeconds);
    }
  };
