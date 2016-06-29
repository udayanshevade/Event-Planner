'use strict';

/**
 * @ngdoc function
 * @name eventPlannerApp.controller:CreateCtrl
 * @description
 * # CreateCtrl
 * Controller of the eventPlannerApp
 */
angular.module('eventPlannerApp')
  .controller('CreateCtrl', ['$scope', 'usercreds', function ($scope, usercreds) {

    var self = this;

    /*
     * Reset parameters of the event creation module
     */
    this.reset = function() {
      // set event creation parameters to default
      this.name = 'New Event Name';
      this.creator = usercreds.user.$id;
      this.host = usercreds.user.$id || usercreds.user.username;
      this.location = '';
      this.type = '';
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

      this.date = new Date();
      this.currentDate = new Date();
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
    this.createEvent = function() {

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

      // add event to the user's created events
      usercreds.createdEvents.$add(event)
        // and once added
        .then(function(ref) {
          var id = ref.key();
          // add it with the same id to the main events object
          $scope.events[id] = event;
          // persist the main events
          $scope.events.$save()
            .then(function() {
              // success -- add to main events object

              // navigate back to the dashboard
              $scope.changeState('dashboard');
            }, function() {
              // error handling -- failure to add to main events object
            });
      }, function() {
        // error handling -- failure to add to user-created events
      });

      console.log('Creating event...');

      // blanks the event handler
      this.reset();

    };

    // default state of the event creation form
    this.reset();

  }]);
