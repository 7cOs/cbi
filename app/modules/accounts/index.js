'use strict';

module.exports =
  angular.module('cf.modules.accounts', [
    // load your sample submodules here, e.g.:
    // require('./bar').name
  ])
  .config(function ($stateProvider) {
    $stateProvider
    .state('accounts', {
      url: '/accounts',
      title: 'Account Dashboard',
      templateUrl: './app/modules/accounts/layout.html',
      controller: 'accountsController',
      controllerAs: 'a'
    });
  })
  .controller('accountsController', require('./accountsController'));
