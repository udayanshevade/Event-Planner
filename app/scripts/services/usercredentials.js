'use strict';

/**
 * @ngdoc function
 * @name eventPlannerApp.service:usercreds
 * @description
 * # usercreds Service
 * Controller of the eventPlannerApp
 */
angular.module('eventPlannerApp')
  .service('usercreds', ['$firebaseObject', '$firebaseArray', function($firebaseObject, $firebaseArray) {
    var self = this;

    this.user = {};

    this.loginSuccess = function() {
      this.user = $firebaseObject(self.ref);
      this.accountRef = this.ref.child('account');
      this.contactsRef = this.ref.child('contacts');
      this.contacts = $firebaseArray(self.contactsRef);
      this.account = $firebaseObject(self.accountRef);
      this.updateCredentials();
      this.loggedIn = true;
      this.createdEventsRef = this.ref.child('created');
      this.invitedEventsRef = this.ref.child('invited');
      this.createdEvents = $firebaseArray(self.createdEventsRef);
      this.createdEventsObject = $firebaseObject(self.createdEventsRef);
      this.invitedEvents = $firebaseArray(self.invitedEventsRef);
    };

    this.logout = function() {
      // log out of app
      this.loggedIn = false;
    };

    this.updateCredentials = function() {
      this.user.$loaded(function() {
        self.email = self.user.account.email;
        self.name = self.user.account.name;
        self.username = self.user.$id;
        self.password = self.user.account.password;
        self.employer = self.user.account.employer;
        self.position = self.user.account.position;
        self.birthday = new Date(self.user.account.birthday);
      });
    };
}]);