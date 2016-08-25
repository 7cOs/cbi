'use strict';

function DatepickerController($scope) {
  $scope.myDate = new Date();
  $scope.minDate = new Date(
    $scope.myDate.getFullYear(),
    $scope.myDate.getMonth() - 2,
    $scope.myDate.getDate());
  $scope.maxDate = new Date(
    $scope.myDate.getFullYear(),
    $scope.myDate.getMonth() + 2,
    $scope.myDate.getDate());
  $scope.onlyWeekendsPredicate = function(date) {
    var day = date.getDay();
    return day === 0 || day === 6;
  };
}

module.exports =
  angular.module('cf.common.components.datepicker', [])
  .component('datepicker', {
    templateUrl: './app/shared/components/datepicker/datepicker.html',
    controller: DatepickerController
  });
