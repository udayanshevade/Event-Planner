'use strict';

/**
 * @ngdoc function
 * @name eventPlannerApp.directive:eventPreview
 * @description
 * # eventPreview Directive
 * Directive of the eventPlannerApp
 */
angular.module('eventPlannerApp')
  .directive('eventPreview', function() {
    return {
      restrict: 'E',
      templateUrl: '../../views/partials/eventPreview.html',
      replace: true,
      controller: 'EventPreviewCtrl',
      controllerAs: 'eventPreview',
      scope: {
        eventData: '=',
        eventsRef: '='
      }
    };
});
