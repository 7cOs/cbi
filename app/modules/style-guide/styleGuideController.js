'use strict';

module.exports =
  function styleGuideController($rootScope, $scope, $state, $mdDialog) {

    // Broadcast current page name for other scopes
    $rootScope.$broadcast('page:loaded', $state.current.name);
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
