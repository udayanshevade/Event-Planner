'use strict';

/**
 * @ngdoc function
 * @name eventPlannerApp.controller: RegCtrl
 * @description
 * # RegCtrl
 * Controller of the eventPlannerApp
 */
angular.module('eventPlannerApp')
  .controller('RegCtrl', ['$rootScope', '$scope', '$log', 'usercreds', function ($rootScope, $scope, $log, usercreds) {

    var self = this;


    // create temporary cache of details in case user switches form
    if (usercreds.username) {
      self.username = usercreds.username;
    }

    $scope.$watch(function() {
        return self.username;
      }, function(val) {
        usercreds.username = val;
      });

    this.passwordConfirm = '';

    /**
     * Constraints validation
     */
    this.registerUser = function() {
      if (this.password === this.passwordConfirm &&
        !this.checkUser(this.username)) {
        this.addNewUser(this.username, this.email, this.password);
      }
    };

    /*
     * Checks if user is already taken
     */
    this.checkUser = function(user) {
      for (var u in $scope.users) {
        if ($scope.users.hasOwnProperty(u)) {
          if (u === user) {
            $log.log('This username has already been taken.');
            return true;
          }
        }
      }
      return false;
    };

    /**
     * Add the new user to database
     */
    this.addNewUser = function(username, email, password) {
      $scope.users[username] = {
        account: {
          email: email,
          password: password
        }
      };
      $scope.users.$save().then(function() {

        // cache user credentials in local storage
        $rootScope.loggedIn = $scope.$storage.eventPlannerApp.loggedIn = true;
        $scope.$storage.eventPlannerApp.username = self.username;

        var username = $scope.$storage.eventPlannerApp.username;
        usercreds.ref = $scope.usersRef.child(username);
        usercreds.accountRef = usercreds.ref.child('account');

        usercreds.loginSuccess();

        $scope.changeState('dashboard');
      }, function(err) {
        $log.log(err);
      });
    };

}]);
