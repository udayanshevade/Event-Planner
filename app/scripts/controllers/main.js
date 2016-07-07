'use strict';

/**
 * @ngdoc function
 * @name eventPlannerApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the eventPlannerApp
 */
angular.module('eventPlannerApp')
  .controller('MainCtrl', ['$rootScope', '$scope', 'usercreds', '$window', '$firebaseObject', '$firebaseArray', '$state', '$localStorage', function ($rootScope, $scope, usercreds, $window, $firebaseObject, $firebaseArray, $state, $localStorage) {

    /* ngStorage
     * pass $localStorage by reference to hook under $scope
     */
    $scope.$storage = $localStorage;

    // Firebase reference to users data
    $scope.usersRef = new $window.Firebase('https://fendeventplanner.firebaseio.com/users');
    // Firebase reference to events data
    $scope.eventsRef = new $window.Firebase('https://fendeventplanner.firebaseio.com/events');
    var appStorage = $scope.$storage.eventPlannerApp;

    // if localStorage for event planner app exists
    if (appStorage) {
      // sign in user
      var loggedIn = $rootScope.loggedIn = $scope.$storage.eventPlannerApp.loggedIn;

      if (loggedIn) {
        var username = $scope.$storage.eventPlannerApp.username;
        usercreds.ref = $scope.usersRef.child(username);
        usercreds.loginSuccess();
      }

    } else {
      // else initialize new planner app memory object
      $scope.$storage.eventPlannerApp = {};
      $scope.$storage.eventPlannerApp.loggedIn = false;
    }

    // Firebase object of users
    $scope.users = $firebaseObject($scope.usersRef);
    $scope.usersArray = $firebaseArray($scope.usersRef);
    // Firebase object of events
    $scope.events = $firebaseArray($scope.eventsRef);
    $scope.eventsObject = $firebaseObject($scope.eventsRef);

    // navigate to a new target state
    $scope.changeState = function(target, options) {
      if (target === 'previous' && $rootScope.previousStates) {
        $rootScope.backing = true;
        var previousState = $rootScope.previousStates.pop();
        $scope.changeState(previousState.name,
          previousState.params);
      } else if (options) {
        $state.go(target, options);
      } else {
        $state.go(target);
      }
    };

  }]);
