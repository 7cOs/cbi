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
      }, 3000);

      $timeout(function () {
        model.multipleTargetListsSelected = false;
      }, 6000);
    }

    function showPerformanceDataErrorToast() {
      model.performanceDataError = true;

      $timeout(() => {
        model.performanceDataError = false;
      }, 10000);
    }

    function showOpportunityCountErrorToast() {
      model.opportunityCountError = true;

      $timeout(() => {
        model.opportunityCountError = false;
      }, 10000);
    }
  };
