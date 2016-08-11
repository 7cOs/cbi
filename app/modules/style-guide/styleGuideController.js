'use strict';

module.exports =
  function styleGuideController($rootScope, $scope, $state, $mdDialog) {

    // Set page title for head and nav
    $rootScope.pageTitle = $state.current.title;

    $scope.pageTitle = 'Style Guide';

    $scope.showAdvanced = function(ev) {
      var parentEl = angular.element(document.body);
      $mdDialog.show({
        clickOutsideToClose: true,
        parent: parentEl,
        targetEvent: ev,
        templateUrl: './app/modules/style-guide/demo-modal.html'
      });
    };
  };
