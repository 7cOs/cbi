'use strict';

module.exports =
  angular.module('cf.common.components.navbar', [])
  .component('navbar', {
    templateUrl: './app/shared/components/navbar/navbar.html',
    controller: 'navbarController',
    controllerAs: 'nb'
  })
  .controller('navbarController', require('./navbarController'));
