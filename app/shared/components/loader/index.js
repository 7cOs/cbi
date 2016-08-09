'use strict';

function LoaderController($scope) {

}

module.exports =
  angular.module('orion.common.components.loader', [])
  .component('loader', {
    templateUrl: './app/shared/components/loader/loader.html',
    controller: LoaderController
  });
