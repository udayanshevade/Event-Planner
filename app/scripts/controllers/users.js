'use strict';

/**
 * @ngdoc function
 * @name eventPlannerApp.controller:UsersCtrl
 * @description
 * # UsersCtrl
 * Controller of the eventPlannerApp
 */
angular.module('eventPlannerApp')
  .controller('UsersCtrl', ['$scope', 'usercreds', function ($scope, usercreds) {

    var self = this;

    this.loading = true;

    this.users = null;

    $scope.users.$loaded().then(function() {
      self.users = $scope.usersArray;
      self.loading = false;
    });

    usercreds.contactsArray.$loaded().then(function() {
      self.contacts = usercreds.contactsArray;
      self.loading = false;
    });

    usercreds.user.$loaded().then(function() {
      self.self = usercreds.username;
    });

  }]);
