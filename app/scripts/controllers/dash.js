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
    });

    usercreds.createdEvents.$loaded(function() {
      self.createdEvents = usercreds.createdEvents;
      self.openTab = self.createdEvents.length ? 0 : 1;
      self.loading = false;
    });

    usercreds.invitedEvents.$loaded(function() {
      self.invitedEvents = usercreds.invitedEvents;
      self.loading = false;
    });

}]);
