'use strict';

module.exports = /*  @ngInject */
  function toastService($timeout) {

    var model = {
      archived: false,
      deleted: false,
      copied: false,
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
     * @memberOf cf.common.services
     */
    function showToast(targetListAction, selectedTargetLists) {
      if (selectedTargetLists.length > 1) {
        model.multipleTargetListsSelected = true;
      }

      if (targetListAction === 'archive') {
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
      }, 3000);

      $timeout(function () {
        model.multipleTargetListsSelected = false;
      }, 6000);
    }
  };
