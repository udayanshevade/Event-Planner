'use strict';

/**
 * @ngdoc function
 * @name eventPlannerApp.controller:CreateCtrl
 * @description
 * # CreateCtrl
 * Controller of the eventPlannerApp
 */
angular.module('eventPlannerApp')
  .controller('EventPreviewCtrl', ['$scope', 'usercreds', '$firebaseObject', '$mdDialog', function ($scope, usercreds, $firebaseObject, $mdDialog) {

    var self = this;

    this.confirmDelete = function(ev) {
      var confirm = $mdDialog.confirm()
        .title('Remove Event')
        .textContent('Are you sure you want to remove this event? Removing it will erase the event completely.')
        .ariaLabel('Remove Event')
        .targetEvent(ev)
        .ok('Remove it')
        .cancel('Not now');
      $mdDialog.show(confirm).then(function() {
        // Confirmed Deletion of Event
        self.delete();
      }, function() {
        // do nothing
      });
    };

    this.delete = function() {
      var id = $scope.eventData.$id;
      usercreds.createdEvents.$remove($scope.eventData)
        .then(function() {
          // remove from the main events storage too
          $firebaseObject($scope.eventsRef.child(id)).$remove()
            .then(function() {
              // success - removed from main events
            }, function() {
              // error handling - failure to remove from main events
            });
        }, function() {
          // error handling - failure to remove from user-created events
        });
    };

  }]);
