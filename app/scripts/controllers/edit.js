'use strict';

/**
 * @ngdoc function
 * @name eventPlannerApp.controller:EditCtrl
 * @description
 * # EditCtrl
 * Controller of the eventPlannerApp
 */
angular.module('eventPlannerApp')
  .controller('EditCtrl', ['$rootScope', '$scope', '$stateParams', 'usercreds', '$firebaseArray', function ($rootScope, $scope, $stateParams, usercreds, $firebaseArray) {

    var self = this;

    this.eventID = $stateParams.eventID;

    self.loading = true;

    $scope.eventsObject.$loaded(function() {
      for (var key in $scope.eventsObject) {
        if (key === $stateParams.eventID) {
          self.details = $scope.eventsObject[key];
          self.blockEditing();
        }
      }

      self.timeZone = self.details.startTime.substring(17);
      self.startTime = self.details.startTime.substring(0, 5);
      self.endTime = self.details.endTime.substring(0, 5);

      self.reset();

      self.loading = false;

    });

    /*
     * Reset parameters of the event creation module
     */
    this.reset = function() {
      // set event creation parameters to default
      this.name = this.details.name;
      this.creator = this.details.creator;
      this.host = this.details.host;
      this.location = this.details.location;
      this.type = this.details.type;

      this.currentTime = new Date();
      this.currentDate = new Date();
      this.currentDate.setHours(0,0,0,0);

      this.startDate = new Date(self.details.startDate) || null;
      this.endDate = new Date(self.details.endDate) || null;
      this.startTime = new Date(self.details.startDate + ' ' + self.details.startTime);
      this.endTime = new Date(self.details.endDate + ' ' + self.details.endTime);

      this.defaultTypes = [
        'Conference',
        'Wedding',
        'Reunion',
        'Birthday',
        'Party'
      ];
      this.message = this.details.message || '';

      this.guestList = this.details.guests || [];

      this.cachedGuestList = [];

      this.guestList.forEach(function(guest) {
        self.cachedGuestList.push(guest);
      });

      this.removedGuests = [];

      console.log('Resetting fields');
    };

    /*
     * TODO: Load guests list in autocomplete feature
     */
    this.loadContacts = function(query) {
      // for jshint's sake
      console.log(query);

      var contacts = usercreds.contactsArray.map(function(elem) {
        return elem.$id;
      });

      console.log(contacts);

      return contacts;
    };

    /*
     * Create a new user event
     */
    this.editEvent = function() {

      if ($scope.editForm.$valid) {

        // convert dates to strings for storage in Firebase
        this.startDateString = this.startDate.toDateString();
        this.endDateString = this.endDate.toDateString();
        this.startTimeString = this.startTime.toTimeString();
        this.endTimeString = this.endTime.toTimeString();

        // construt event for storage
        self.event = {
          creator: self.creator,
          name: self.name,
          host: self.host,
          location: self.location,
          startDate: self.startDateString,
          endDate: self.endDateString,
          startTime: self.startTimeString,
          endTime: self.endTimeString,
          type: self.type,
          guests: self.guestList,
          message: self.message
        };

        // add it with the same id to the main events object
        $scope.eventsObject[self.eventID] = self.event;
        // persist the main events
        $scope.eventsObject.$save()
          .then(function() {
            var sameGuests = self.cachedGuestList.every(function(el, i) {
              if (self.guestList[i]) {
                return el.text === self.guestList[i].text;
              } else { return false; }
            });
            // success -- add to main events object
            var noChange = sameGuests &&
              self.cachedGuestList.length === self.guestList.length;

            console.log(self.cachedGuestList, self.guestList);

            if (!noChange) {
              self.editInvites();
              console.log('There was a change in the guest list.');
            } else {
              self.updateInvites();
              console.log('There was no change in the guest list.');
            }
            // navigate back to the dashboard
            $scope.changeState('event', {
              'eventID': self.eventID
            });
          }, function() {
            // error handling -- failure to add to main events object
          });

        console.log('Editing event...');

      }

    };

    this.editInvites = function() {
      // first prune any removed invites
      // THEN invoke the update/add function
      this.removeInvites();
    };

    this.removeInvites = function() {
      var guestRef, invitesRef, invites, invite;
      if (this.removedGuests.length) {
        this.removedGuests.forEach(function(guest) {
          guestRef = $scope.usersRef.child(guest);

          // if the guest is a user with invites
          if (guestRef) {
            // set up a reference to the event node
            invitesRef = guestRef.child('invited');

            if (invitesRef) {
              // set up a node object to $remove
              invites = $firebaseArray(invitesRef);
              // return promise for object
              invites.$loaded().then(function() {
                angular.forEach(invites, function(e, k) {
                  if (e.event === self.eventID) {
                    invite = invites[k];
                  }
                });
                // remove the event invite for the user
                invites.$remove(invite).then(function() {
                  // success: removed an invite
                  console.log('Removed the invite to ' + guest);

                  // next add/update invites for those in the updated list
                  self.updateInvites();

                }, function() {
                  // fail: could not remove the invite
                  console.log('Nooo, ' + guest + ' still thinks they\'re invited....How awkward. Hope they don\'t show up.');
                });
              });
            }
          }
        });
      } else { this.updateInvites(); }
    };

    this.updateInvites = function() {
      var isGuest, guestRef, invitesRef, invites, hasInvite;
      this.guestList.forEach(function(guest) {
        isGuest = $scope.users[guest.text];
        if (isGuest) {
          guestRef = $scope.usersRef.child(guest.text);
          invitesRef = guestRef.child('invited');

          // set up a node object to $remove
          invites = $firebaseArray(guestRef.child('invited'));
          // return promise for object
          invites.$loaded().then(function() {
            hasInvite = false;
            angular.forEach(invites, function(invite) {
              if (invite.event === self.eventID) {
                hasInvite = true;
              }
            });

            if (!hasInvite) {
              invites.$add({ event: self.eventID })
                .then(function() {
                  console.log('Success! ' + guest.text + ' was updated/invited!');
                }, function() {
                  console.log('Nooo, ' + guest.text + 'got left out!');
              });
            }
          });
        }
      });
    };

    this.removeTag = function(tag) {
      this.removedGuests.push(tag.text);
      console.log(this.removedGuests);
    };

    this.addTag = function(tag) {
      console.log('Adding ' + tag.text);
    };

    this.blockEditing = function() {
      usercreds.user.$loaded(function() {
        self.hasHostAccess = (self.details.host === usercreds.username ||
          self.details.host === usercreds.user.$id) || (self.details.creator === usercreds.username || self.details.creator === usercreds.user.$id);
        if (!self.hasHostAccess) {
          $rootScope.backing = true;
          $scope.changeState('event', { eventID: $stateParams.eventID });
        } else { console.log('You\'re fine'); }
      });
    };

  }]);
