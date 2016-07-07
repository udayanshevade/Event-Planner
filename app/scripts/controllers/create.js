'use strict';

/**
 * @ngdoc function
 * @name eventPlannerApp.controller:CreateCtrl
 * @description
 * # CreateCtrl
 * Controller of the eventPlannerApp
 */
angular.module('eventPlannerApp')
  .controller('CreateCtrl', ['$scope', 'usercreds', 'createDetails', '$firebaseArray', function ($scope, usercreds, createDetails, $firebaseArray) {

    var self = this;

    var categories = ['name', 'host', 'location', 'type', 'startTime', 'endTime', 'message', 'guestList', 'startDate', 'endDate'];

    // create temporary cache of details in case user exits form before done
    var watchDetailFn = function(det) {
      return function() {
        return self[det];
      };
    };

    var assignDetailFn = function(name) {
      return function(val) {
        createDetails[name] = val;
      };
    };

    var watchDetail, assignDetail;
    for (var cat = 0, catLength = categories.length; cat < catLength; cat ++) {
      if (!createDetails[categories[cat]]) {
        watchDetail = watchDetailFn(categories[cat]);
        assignDetail = assignDetailFn(categories[cat]);

        $scope.$watch(watchDetail, assignDetail);
      }
    }

    /*
     * Reset parameters of the event creation module
     */
    this.reset = function() {
      // set event creation parameters to default
      this.name = createDetails.name || '';
      this.creator = usercreds.user.$id || '';
      this.host = createDetails.host || usercreds.user.$id || usercreds.user.username || '';
      this.location = createDetails.location || '';
      this.type = createDetails.type || '';
      this.currentTime = new Date();
      this.startTime = createDetails.startTime || new Date();
      this.endTime = createDetails.endTime || new Date((new Date()).setHours(self.startTime.getHours()+1));
      this.defaultTypes = [
        'Conference',
        'Wedding',
        'Reunion',
        'Birthday',
        'Party'
      ];
      this.message = createDetails.message || '';

      this.guestList = createDetails.guestList || [usercreds.user.$id];

      this.startDate = createDetails.startDate || new Date();
      this.startDate.setHours(0,0,0,0);
      this.endDate = createDetails.endDate || new Date();
      this.endDate.setHours(0,0,0,0);
      this.currentDate = new Date();
      this.currentDate.setHours(0,0,0,0);

      this.event = {};
    };

    /*
     * TODO: Load guests list in autocomplete feature
     */
    this.loadContacts = function() {
      var contacts = usercreds.contactsArray.map(function(elem) {
        return elem.$id;
      });

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

        // construct event for storage
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

        // add event to the main events
        $scope.events.$add(self.event)
          // and once added
          .then(function(ref) {
            var id = ref.key();

            // and store it in the users created events records
            usercreds.createdEvents.$add({event: id});
            // persist event invitation to guest refs
            self.inviteGuests(id);

            for (var cat = 0, catLength = categories.length; cat < catLength; cat ++) {
              self[categories[cat]] = null;
            }

            // navigate back to the dashboard
            $scope.changeState('dashboard');
          }, function() {
            // error handling -- failure to add to main events object
          });

      }

    };

    this.inviteGuests = function(id) {
      this.guestList.forEach(function(guest) {
        if (guest.text !== usercreds.user.$id) {
          self.inviteGuest(guest.text, id);
        }
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
            // success
          }, function() {
            // TODO: add fallback contingency
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
