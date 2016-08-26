'use strict';

function LoaderController($scope) {

}

module.exports =
  angular.module('cf.common.components.loader', [])
  .component('loader', {
    templateUrl: './app/shared/components/loader/loader.html',
    controller: LoaderController
  });
