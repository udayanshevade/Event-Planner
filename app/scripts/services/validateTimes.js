'use strict';

/**
 * @ngdoc function
 * @name eventPlannerApp.service:validateTimes
 * @description
 * # validateTimes Service
 * Controller of the eventPlannerApp
 */
angular.module('eventPlannerApp')
  .service('validateTimes', function() {

    this.compare = function(startTime, endTime) {
      startTime = startTime.getTime();
      endTime = endTime.getTime();

      if (startTime < endTime) {
        return 'earlier';
      } else if (startTime === endTime) {
        return 'same';
      } else {
        return 'later';
      }
    };

  });