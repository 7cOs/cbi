'use strict';

module.exports = /*  @ngInject */
  function toastService($timeout) {

    var model = {
      archived: false,
      deleted: false,
      copied: false,
      deleteError: false,
      multipleTargetListsSelected: false
    };

    var service = {
      model: model,
      showToast: showToast
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

      if (targetListAction === 'deleteError') {
        model.deleteError = true;
      } else if (targetListAction === 'archive') {
        model.archived = true;
      } else if (targetListAction === 'delete') {
        model.deleted = true;
      } else if (targetListAction === 'copy') {
        model.copied = true;
      }

      // Reset defaults
      $timeout(function () {
        model.deleted = false;
        model.archived = false;
        model.copied = false;
        model.deleteError = false;
      }, 3000);

      $timeout(function () {
        model.multipleTargetListsSelected = false;
      }, 6000);
    }
  };
