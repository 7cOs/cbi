'use strict';

const Environment = require('../../../environment').Environment;

module.exports =
  angular.module('cf.common.components.navbar', [])
  .component('navbar', {
    template: require('./navbar.pug'),
    controller: 'navbarController',
    controllerAs: 'nb'
  })
  .controller('navbarController', require('./navbarController'))
  .constant('ENV_VARS', {
    iqURL: Environment.getIQLink()
  });
