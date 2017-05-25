'use strict';

// this component is a wrapper around ui-router's ui-view directive,
// so ui-view can be upgraded and used within an angunar 4 root component
module.exports =
  angular.module('cf.common.components.appView', [])
  .component('appView', {
    template: require('./app-view.pug'),
    controller: 'appViewController',
    controllerAs: 'av'
  })
  .controller('appViewController', require('./appViewController'));
