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
      this.contacts = $firebaseObject(self.contactsRef);
      this.contactsArray = $firebaseArray(self.contactsRef);
      this.account = $firebaseObject(self.accountRef);
      this.updateCredentials();
      this.loggedIn = true;
      this.createdEventsRef = this.ref.child('created');
      this.invitedEventsRef = this.ref.child('invited');
      this.createdEvents = $firebaseArray(self.createdEventsRef);
      this.createdEventsObject = $firebaseObject(self.createdEventsRef);
      this.invitedEvents = $firebaseArray(self.invitedEventsRef);
      this.invitedEventsObject = $firebaseObject(self.createdEventsRef);
    };

    this.logout = function() {
      // log out of app
      this.loggedIn = false;
      this.user = {
        account: {}
      };
      this.assignCredentials();
    };

    this.updateCredentials = function() {
      this.user.$loaded(function() {
        self.assignCredentials();
      });
    };

    this.assignCredentials = function() {
      this.email = this.user.account.email;
      this.name = this.user.account.name;
      this.username = this.user.$id;
      this.password = this.user.account.password;
      this.employer = this.user.account.employer;
      this.position = this.user.account.position;
      this.blurb = this.user.account.blurb;
      this.birthday = this.user.account.birthday ? new Date(this.user.account.birthday) : null;
    };

}]);