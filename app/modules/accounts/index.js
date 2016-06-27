'use strict';

module.exports =
  angular.module('andromeda.modules.accounts', [
    //load your sample submodules here, e.g.:
    //require('./bar').name
  ])
  .config(function ($stateProvider) {
    $stateProvider
    .state('accounts', {
      url: '/accounts/',
      templateUrl: 'modules/accounts/index.html',
      controller: 'accountsController'
    });
  })
  .controller('accountsController', require('./accountsController'));

