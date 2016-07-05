'use strict';

/**
 * @ngdoc function
 * @name eventPlannerApp.controller:EventCtrl
 * @description
 * # EventCtrl
 * Controller of the eventPlannerApp
 */
angular.module('eventPlannerApp')
  .controller('EventCtrl', ['$scope', '$stateParams', 'usercreds', function ($scope, $stateParams, usercreds) {

    var self = this;

    this.loading = true;

    this.eventID = $stateParams.eventID;

    this.details = null;

    $scope.events.$loaded(function() {
      angular.forEach($scope.events, function(event) {
        console.log(event.$id === self.eventID);
        if (event.$id === self.eventID) {
          self.details = event;
        }
      });

      self.timeZone = self.details.startTime.substring(17);
      self.startTime = self.details.startTime.substring(0, 5);
      self.endTime = self.details.endTime.substring(0, 5);

      var host = self.details.host;
      var creator = self.details.creator;

      usercreds.user.$loaded(function() {
        self.hasHostAccess = (host === usercreds.username ||
          host === usercreds.user.$id) || (creator === usercreds.username || creator === usercreds.user.$id);
      });

      self.loading = false;

    });

  }]);
