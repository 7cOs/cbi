'use strict';

module.exports =
  angular.module('cf.common.components.page', [])
  .component('page', {
    templateUrl: './app/shared/components/page/page.html',
    controller: 'pageController',
    controllerAs: 'page'
  })
  .controller('pageController', require('./pageController'));
