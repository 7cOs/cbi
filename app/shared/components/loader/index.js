'use strict';

function LoaderController($scope) {

}

module.exports =
  angular.module('cf.common.components.loader', [])
  .component('loader', {
    template: require('./loader.pug'),
    controller: LoaderController
  });
