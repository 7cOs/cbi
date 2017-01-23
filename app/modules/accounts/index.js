'use strict';

module.exports =
  angular.module('cf.modules.accounts', [
    // load your sample submodules here, e.g.:
    // require('./bar').name
  ])
  .config(function ($stateProvider) {
    $stateProvider
    .state('accounts', {
      url: '/accounts?store',
      title: 'Account Dashboard',
      templateUrl: './app/modules/accounts/layout.html',
      controller: 'accountsController',
      controllerAs: 'a',
      params: {
        resetFiltersOnLoad: true,
        applyFiltersOnLoad: false,
        openNotesOnLoad: false,
        pageData: {
          brandTitle: '',
          depletionTimePeriod: '',
          distributionTimePeriod: '',
          account: {}
        },
        id: ''
      },
      analyticsData: {
        pageTitle: 'Performance : Account Dashboard'
      }
    });
  })
  .controller('accountsController', require('./accountsController'));
