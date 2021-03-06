/**
 *
 * The MIT License (MIT)
 * Copyright (c) 2016 Crawlink
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated
 * documentation files (the "Software"), to deal in the Software without restriction, including without limitation
 * the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software,
 * and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions
 * of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED
 * TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
 * THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF
 * CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
 * IN THE SOFTWARE.
 *
 */

/**
 * Modified from material-angular-paging
 * https://github.com/Crawlink/material-angular-paging
 */

'use strict';

module.exports =
  function clPaging() {
    var directive = {
      restrict: 'EA',
      scope: {
        clPages: '=',
        clAlign: '@',
        clAlignModel: '=',
        clPageChanged: '&',
        clSteps: '=',
        clCurrentPage: '='
      },
      controller: ClPagingController,
      controllerAs: 'paging',
      template: require('./cl-paging.pug')
    };

    /*  @ngInject */
    function ClPagingController($scope) {
      var vm = this;

      vm.first = '<<';
      vm.last = '>>';

      vm.index = 0;

      vm.clSteps = $scope.clSteps;
      vm.clPages = $scope.clPages;
      vm.clCurrentPage = $scope.clCurrentPage;

      vm.goto = function (index) {
        $scope.clCurrentPage = vm.page[index];
      };

      vm.gotoPrev = function () {
        $scope.clCurrentPage = vm.index;
        vm.index -= vm.clSteps;
      };

      vm.gotoNext = function () {
        vm.index += vm.clSteps;
        $scope.clCurrentPage = vm.index + 1;
      };

      vm.gotoFirst = function () {
        vm.index = 0;
        $scope.clCurrentPage = 1;
      };

      vm.gotoLast = function () {
        vm.index = parseInt($scope.clPages / vm.clSteps) * vm.clSteps;
        vm.index === $scope.clPages ? vm.index = vm.index - vm.clSteps : '';
        $scope.clCurrentPage = $scope.clPages;
      };

      $scope.$watch('clCurrentPage', function (value) {
        vm.index = parseInt((value - 1) / vm.clSteps) * vm.clSteps;
        vm.clCurrentPage = $scope.clCurrentPage;
        $scope.clPageChanged();
      });

      $scope.$watch('clPages', function () {
        vm.init();
      });

      vm.init = function () {
        vm.stepInfo = (function () {
          var result = [];
          for (var i = 0; i < vm.clSteps; i++) {
            result.push(i);
          }
          return result;
        })();

        vm.page = (function () {
          var result = [];
          for (var i = 1; i <= $scope.clPages; i++) {
            result.push(i);
          }
          return result;
        })();
      };
    };

    return directive;
  };
