'use strict';

/**
 * @ngdoc function
 * @name eventPlannerApp.controller:DashCtrl
 * @description
 * # DashCtrl
 * Controller of the eventPlannerApp
 */
angular.module('eventPlannerApp')
  .controller('DashCtrl', ['$scope', 'usercreds', function ($scope, usercreds) {

    var self = this;

    this.loading = true;

    usercreds.user.$loaded(function() {
      self.username = usercreds.name || usercreds.user.$id;
      self.usercredsLoaded = true;
      self.checkIfLoaded();
    });

    usercreds.createdEvents.$loaded(function() {
      self.createdEvents = usercreds.createdEvents;
      self.openTab = self.createdEvents.length ? 0 : 1;
      self.createdEventsLoaded = true;
      self.checkIfLoaded();
    });

    usercreds.invitedEvents.$loaded(function() {
      self.invitedEvents = usercreds.invitedEvents;
      self.invitedEventsLoaded = true;
      self.checkIfLoaded();
    });

    this.checkIfLoaded = function() {
      if (this.usercredsLoaded &&
          this.createdEventsLoaded &&
          this.invitedEventsLoaded) {
        this.loading = false;
      }
    };

}]);
