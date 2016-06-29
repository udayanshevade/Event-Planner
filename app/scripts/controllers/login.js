'use strict';

/**
 * @ngdoc function
 * @name eventPlannerApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the eventPlannerApp
 */
angular.module('eventPlannerApp')
  .controller('LoginCtrl', ['$rootScope', '$scope', '$log', '$firebaseObject', 'usercreds', function ($rootScope, $scope, $log, $firebaseObject, usercreds) {

    //var self = this;

    // initialize the user login credentials
    /*
    this.username = usercreds.user.$id;
    this.email = usercreds.user.account.email;
    this.password = usercreds.user.account.password;

    // watch username
    $scope.$watch(function() {
      return self.username;
    }, function(val) {
      usercreds.username = val;
    });
    // watch email
    $scope.$watch(function() {
      return self.email;
    }, function(val) {
      usercreds.email = val;
    });
    // watch password
    $scope.$watch(function() {
      return self.password;
    }, function(val) {
      usercreds.password = val;
    });

    */

    this.failure = false;

    /**
     * login existing user
     */
    this.loginUser = function() {
      //$log.log($scope.users);
      var entered = this.username || this.email;
      var matched;
      var users = $scope.users;

      if (users.$value !== 'none') {

        // Check through users
        for (var u in users) {

          matched = false;

          if (users.hasOwnProperty(u)) {

            // $log.log('Checking users.');

            switch (entered) {
              case this.username:
                if (u === this.username) {
                  matched = true;
                  // check password
                  // $log.log('Verifying password with user.');
                }
                break;
              case this.email:
                var key = users[u];
                if (key && key.account &&
                  (key.account.email === this.email)) {
                  matched = true;
                  this.username = u;
                  // check password
                  // $log.log('Verifying password with email.');
                }
                break;
              default:
                $log.log('No matches.');
                break;
            }

            if (matched && this.verifyPassword(u)) {
              this.loginSuccess();
              break;
            } else {
              this.failure = true;
            }

          }
        }

      } else {
        // $log.log('No users yet. Please register.');
      }

    };

    /*
     * Returns true/false whether the password matches
     */
    this.verifyPassword = function(u) {
      if ($scope.users[u].account.password === this.password) {
        $log.log('Logging in.');
        return true;
      } else {
        // $log.log('Incorrect password. Please try again.');
        return false;
      }
    };

    /*
     * Logs in successfully
     */
    this.loginSuccess = function() {
      this.failure = false;
      // cache user credentials in local storage
      $rootScope.loggedIn = $scope.$storage.eventPlannerApp.loggedIn = true;
      $scope.$storage.eventPlannerApp.email = this.email;
      $scope.$storage.eventPlannerApp.username = this.username;

      var username = $scope.$storage.eventPlannerApp.username;
      usercreds.ref = $scope.usersRef.child(username);
      usercreds.accountRef = usercreds.ref.child('account');

      usercreds.loginSuccess();

      // change state to dashboard
      $scope.changeState('dashboard');
    };

  }]);
