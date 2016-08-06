'use strict';

/**
 * @ngdoc function
 * @name eventPlannerApp.controller:HeaderCtrl
 * @description
 * # HeaderCtrl
 * Controller of the eventPlannerApp
 */
angular.module('eventPlannerApp')
  .controller('HeaderCtrl', ['$rootScope', '$scope', 'usercreds', 'createDetails', function ($rootScope, $scope, usercreds, createDetails) {

    this.logout = function() {
      for (var k in $scope.$storage.eventPlannerApp) {
        delete $scope.$storage.eventPlannerApp[k];
      }
      usercreds.logout();
      createDetails.reset();
      $rootScope.loggedIn = false;
      // change state to login
      $scope.changeState('login');
    };


  }]);
