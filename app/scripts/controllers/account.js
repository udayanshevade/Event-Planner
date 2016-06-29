'use strict';

/**
 * @ngdoc function
 * @name eventPlannerApp.controller:AccountCtrl
 * @description
 * # AccountCtrl
 * Controller of the eventPlannerApp
 */
angular.module('eventPlannerApp')
  .controller('AccountCtrl', ['$scope', 'usercreds', function ($scope, usercreds) {

    var self = this;

    this.loading = true;
    self.birthdayString = '';

    // initialize the user login credentials
    usercreds.user.$loaded(function() {
      self.username = usercreds.username;
      self.name = usercreds.name || '';
      self.email = usercreds.email;
      self.password = usercreds.password;
      self.birthday = usercreds.birthday || null;
      self.employer = usercreds.employer || '';
      self.position = usercreds.position || '';
      self.loading = false;
    });

    /**
     * Save account details
     */
    this.editAccount = function() {

      if (self.birthday) {
        self.birthdayString = self.birthday.toDateString();
      }

      var accountDetails = {
        name: self.name,
        email: self.email,
        password: self.password,
        birthday: self.birthdayString,
        employer: self.employer,
        position: self.position
      };

      $scope.users[self.username].account = accountDetails;

      $scope.users.$save()
        .then(function() {
          // success -- updated user info in database
          usercreds.updateCredentials();

          console.log(usercreds.user);
        }, function() {
          // error handling -- failure to update user info
        });

    };

  }]);
