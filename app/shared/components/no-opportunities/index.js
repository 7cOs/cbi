'use strict';

function NoOpportunitiesController() {

};

module.exports =
  angular.module('andromeda.common.components.no-opportunities', [])
  .component('noOpportunities', {
    templateUrl: './app/shared/components/no-opportunities/no-opportunities.html',
    controller: NoOpportunitiesController,
    controllerAs: 'no-opportunities'
  });
