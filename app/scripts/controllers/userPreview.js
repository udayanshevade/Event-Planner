'use strict';

/**
 * @ngdoc function
 * @name eventPlannerApp.controller:UserPreviewCtrl
 * @description
 * # UserPreviewCtrl
 * Controller of the eventPlannerApp
 */
angular.module('eventPlannerApp')
  .controller('UserPreviewCtrl', ['$scope', function ($scope) {

    this.details = $scope.userData;
    this.username = $scope.username;

  }]);
