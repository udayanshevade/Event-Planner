'use strict';

/**
 * @ngdoc function
 * @name eventPlannerApp.controller:EditCtrl
 * @description
 * # EditCtrl
 * Controller of the eventPlannerApp
 */
angular.module('eventPlannerApp')
  .controller('EditCtrl', ['$scope', '$stateParams', 'usercreds', function ($scope, $stateParams, usercreds) {

    var self = this;

    this.eventID = $stateParams.eventID;

    self.loading = true;

    $scope.events.$loaded(function() {
      for (var key in $scope.events) {
        if (key === $stateParams.eventID) {
          self.details = $scope.events[key];
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
      this.date = new Date(self.details.date);

      this.startTime = new Date(self.details.date + ' ' + self.details.startTime);
      this.endTime = new Date(self.details.date + ' ' + self.details.endTime);

      this.defaultTypes = [
        'Conference',
        'Wedding',
        'Reunion',
        'Birthday',
        'Party'
      ];
      this.message = this.details.message || '';

      this.guestList = this.details.guests || [];
      this.currentDate = new Date();
      console.log('Resetting fields');
    };

    /*
     * TODO: Load guests list in autocomplete feature
     */
    this.loadContacts = function(query) {
      // for jshint's sake
      console.log(query);

      var contacts = usercreds.contacts;

      console.log(contacts);

      return contacts;
    };

    /*
     * Create a new user event
     */
    this.editEvent = function() {

      // convert dates to strings for storage in Firebase
      this.dateString = this.date.toDateString();
      this.startTimeString = this.startTime.toTimeString();
      this.endTimeString = this.endTime.toTimeString();

      // construt event for storage
      var event = {
        creator: self.creator,
        name: self.name,
        host: self.host,
        location: self.location,
        date: self.dateString,
        startTime: self.startTimeString,
        endTime: self.endTimeString,
        type: self.type,
        guests: self.guestList,
        message: self.message
      };

      // update event to the user's created events
      usercreds.createdEventsObject[self.eventID] = event;
      usercreds.createdEventsObject.$save()
        // and once added
        .then(function(ref) {
          var id = ref.key();
          console.log(id);
          console.log(usercreds.createdEvents);
          // add it with the same id to the main events object
          $scope.events[self.eventID] = event;
          // persist the main events
          $scope.events.$save()
            .then(function() {
              // success -- add to main events object

              // navigate back to the dashboard
              $scope.changeState('event', {
                'eventID': self.eventID
              });
            }, function() {
              // error handling -- failure to add to main events object
            });
        }, function(err) {
          // error handling -- failure to add to user-created events
          console.log(err);
        });

      console.log('Editing event...');

    };

  }]);
