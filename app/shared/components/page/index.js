'use strict';

module.exports =
  angular.module('cf.common.components.page', [])
  .component('page', {
    template: require('./page.pug'),
    controller: 'pageController',
    controllerAs: 'page',
    bindings: {
      pageName: '@',
      onPageChange: '&'
    }
  })
  .controller('pageController', require('./pageController'));
