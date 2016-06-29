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
      self.createdEvents = usercreds.createdEvents;

      self.loading = false;
    });

    this.delete = function(event) {
      console.log('Deleting...');
      this.createdEvents.$remove(event);
    };

}]);
