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

      console.log(typeof startTime, startTime);
      console.log(typeof endTime, endTime);

      if (startTime < endTime) {
        return 'earlier';
      } else if (startTime === endTime) {
        return 'same';
      } else {
        return 'later';
      }
    };

  });