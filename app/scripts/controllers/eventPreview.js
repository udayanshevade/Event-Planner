'use strict';

/**
 * @ngdoc function
 * @name eventPlannerApp.controller:CreateCtrl
 * @description
 * # CreateCtrl
 * Controller of the eventPlannerApp
 */
angular.module('eventPlannerApp')
  .controller('EventPreviewCtrl', ['$scope', 'usercreds', '$firebaseObject', '$firebaseArray', '$mdDialog', function ($scope, usercreds, $firebaseObject, $firebaseArray, $mdDialog) {

    var self = this;

    // the ID of the event
    self.eventKey = $scope.eventDetails.event;
    // the event firebase object
    self.event = $firebaseObject($scope.eventsRef.child(self.eventKey));
    // the user record of the created event
    self.createdEvent = $firebaseObject(usercreds.createdEventsRef.child($scope.eventDetails.$id));

    // once the events have loaded
    $scope.events.$loaded(function() {
      // the event data itself
      self.eventData = $scope.events[self.eventKey];
      // whether the user may edit this event
      self.hasHostAccess = self.eventData.host === usercreds.username ||
        self.eventData.creator === usercreds.username;
    });

    // confirm the delete prompt
    this.confirmDelete = function(ev) {
      var confirm = $mdDialog.confirm()
        .title('Remove Event')
        .textContent('Are you sure you want to remove this event? Removing it will erase the event completely.')
        .ariaLabel('Remove Event')
        .targetEvent(ev)
        .ok('Remove it')
        .cancel('Not now');
      $mdDialog.show(confirm).then(function() {
        // confirm event deletion
        self.delete();
      }, function() {
        // do nothing
      });
    };

    // delete the event
    this.delete = function() {
      // ensuring that the event object has loaded...
      self.event.$loaded().then(function() {
        // disinvite event guests
        self.deleteInvites();
        // remove event from overall events
        self.event.$remove()
          .then(function() {
            console.log('The event has been removed.');
            // remove the record from the user's created events
            self.createdEvent.$loaded().then(function() {
              self.createdEvent.$remove()
                .then(function() {
                  // success - removed from main events
                  console.log('The created event record has been removed.');
                }, function() {
                  // error handling - failure to remove from main events
                });
            }, function() {
              // error handling - failure to remove from user-created events
            });
          });
        });
    };


    // iterate through the event hosts and disinvite the guests
    this.deleteInvites = function() {
      var guestName;
      // loop through the guests
      angular.forEach(self.event.guests, function(guest) {
        guestName = guest.text;
        // if the user is present in the database
        if ($scope.users[guestName] && $scope.users[guestName].invited) {
          // delete the guest's specific invitation
          self.deleteInvite(guestName);
        }
      });
    };

    // delete the specific guest's invitation
    this.deleteInvite = function(username) {
      var eventObj;
      // a reference to the guest's invitations
      var userInvitedRef = $scope.usersRef
        .child(username).child('invited');
      // an array of the guest's invitations
      var userInvitedEvents = $firebaseArray(userInvitedRef);

      // ensuring that the invitations have loaded...
      userInvitedEvents.$loaded().then(function() {

        // iterate through the events
        angular.forEach(userInvitedEvents, function(invite, key) {
          // if an ID is the same as the current event's ID
          if (invite.event === self.eventKey) {
            eventObj = userInvitedEvents[key];
            // remove the invitation
            userInvitedEvents.$remove(eventObj).then(function() {
              // removed guest's invited event object
              console.log('Success! ' + username + ' has been uninvited. Maybe next time they\'ll think twice before making plans with you...');
            }, function() {
              console.log('Nooo, ' + username  + ' still thinks they are invited...how awkward!');
            });
          }
        });

      }, function() {
        // error handling
      });
    };

  }]);
