'use strict';

/**
 * @ngdoc function
 * @name eventPlannerApp.service:createDetails
 * @description
 * # createDetails Service
 * Controller of the eventPlannerApp
 */
angular.module('eventPlannerApp')
  .service('createDetails', function() {

    this.reset = function() {
      for (var prop in this) {
        if ((prop !== 'reset') && this.hasOwnProperty(prop)) {
          this[prop] = '';
        }
      }
    };

});