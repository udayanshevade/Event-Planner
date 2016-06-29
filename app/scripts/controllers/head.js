'use strict';

/**
 * @ngdoc function
 * @name eventPlannerApp.controller:HeaderCtrl
 * @description
 * # HeaderCtrl
 * Controller of the eventPlannerApp
 */
angular.module('eventPlannerApp')
  .controller('HeaderCtrl', ['$rootScope', '$scope', 'usercreds', function ($rootScope, $scope, usercreds) {

    this.logout = function() {
      for (var k in $scope.$storage.eventPlannerApp) {
        delete $scope.$storage.eventPlannerApp[k];
      }
      usercreds.logout();
      $rootScope.loggedIn = false;
      // change state to login
      $scope.changeState('login');
    };


  }]);
