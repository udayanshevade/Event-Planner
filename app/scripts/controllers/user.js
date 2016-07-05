'use strict';

/**
 * @ngdoc function
 * @name eventPlannerApp.controller:UserCtrl
 * @description
 * # UserCtrl
 * Controller of the eventPlannerApp
 */
angular.module('eventPlannerApp')
  .controller('UserCtrl', ['$rootScope', '$scope', 'usercreds', '$stateParams', '$firebaseObject', function ($rootScope, $scope, usercreds, $stateParams, $firebaseObject) {

    var self = this;

    this.username = $stateParams.handle;

    this.loading = true;

    $scope.users.$loaded(function() {
      var user = $scope.users[self.username];
      if (user) {
        self.exists = true;
        self.details = user.account;
        self.name = self.details.name;
        self.email = self.details.email;
        self.birthday = self.details.birthday;
        self.employer = self.details.employer;
        self.position = self.details.position;
        self.blurb = self.details.blurb;
        self.isContact = usercreds.contacts[self.username];
      } else {
        self.exists = false;
      }
      self.redirect();
    });

    this.toggleContact = function(state) {
      console.log(state);
      if (state) {
        this.addContact(self.username);
      } else {
        this.removeContact(self.username);
      }
    };

    this.addContact = function(user) {
      usercreds.contacts[user] = true;
      usercreds.contacts.$save().then(function() {
        // successfully added contact
      }, function (err) {
        // error handling
        console.log(err);
      });
    };

    this.removeContact = function(user) {
      if (usercreds.contacts[user]) {
        var obj = $firebaseObject(usercreds.contactsRef.child(user));
        obj.$remove().then(function() {
          // successfully removed
        }, function(err) {
          // error handling
          console.log(err);
        });
      }
    };

    this.redirect = function() {
      if (usercreds.username === this.username ||
        (usercreds.name && self.details &&
          usercreds.name === self.details.name)) {
        $rootScope.backing = true;
        console.log('You can view your profile via the Account page.');
        $scope.changeState('account');
      } else { console.log('You can view this public profile.'); }
      self.loading = false;
    };

  }]);
