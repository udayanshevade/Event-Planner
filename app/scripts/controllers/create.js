'use strict';

/**
 * @ngdoc function
 * @name eventPlannerApp.controller:CreateCtrl
 * @description
 * # CreateCtrl
 * Controller of the eventPlannerApp
 */
angular.module('eventPlannerApp')
  .controller('CreateCtrl', ['$scope', 'usercreds', '$firebaseArray', function ($scope, usercreds, $firebaseArray) {

    var self = this;

    /*
     * Reset parameters of the event creation module
     */
    this.reset = function() {
      // set event creation parameters to default
      this.name = '';
      this.creator = usercreds.user.$id || '';
      this.host = usercreds.user.$id || usercreds.user.username || '';
      this.location = '';
      this.type = '';
      this.currentTime = new Date();
      this.startTime = new Date();
      this.endTime = new Date((new Date()).setHours(self.startTime.getHours()+1));
      this.defaultTypes = [
        'Conference',
        'Wedding',
        'Reunion',
        'Birthday',
        'Party'
      ];
      this.message = '';

      this.guestList = [];

      this.startDate = new Date();
      this.startDate.setHours(0,0,0,0);
      this.endDate = new Date();
      this.endDate.setHours(0,0,0,0);
      this.currentDate = new Date();
      this.currentDate.setHours(0,0,0,0);

      this.event = {};
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
    this.createEvent = function() {

      if ($scope.createForm.$valid) {

        // convert dates to strings for storage in Firebase
        this.startDateString = this.startDate.toDateString();
        this.endDateString = this.endDate.toDateString();
        this.startTimeString = this.startTime.toTimeString();
        this.endTimeString = this.endTime.toTimeString();

        // construt event for storage
        this.event = {
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

        // add event to the user's created events
        $scope.events.$add(self.event)
          // and once added
          .then(function(ref) {
            var id = ref.key();

            // and add it with the same id to the main events object
            usercreds.createdEvents.$add({event: id});
            // persist the main events
            // persist event invitation to guest refs
            self.inviteGuests(id);

            // navigate back to the dashboard
            $scope.changeState('dashboard');
          }, function() {
            // error handling -- failure to add to main events object
          });

      }

      console.log('Creating event...');
    };

    this.inviteGuests = function(id) {
      this.guestList.forEach(function(guest) {
        self.inviteGuest(guest.text, id);
      });
    };

    this.inviteGuest = function(guest, id) {
      // create new guest reference
      if ($scope.users[guest]) {
        var guestInvitedEventsRef = $scope.usersRef
          .child(guest).child('invited');
        // create new local firebase object
        var guestInvitedEvents = $firebaseArray(guestInvitedEventsRef);
        // return promise and persist changes
        guestInvitedEvents.$loaded().then(function() {
          guestInvitedEvents.$add({event:id}).then(function() {
            console.log('Invited ' + guest);
          }, function() {
            console.log('Failed to invite' + guest);
          });
        });
      }
    };

    // default state of the event creation form
    usercreds.user.$loaded(function() {
      self.reset();
    });

    this.reset();

  }]);
