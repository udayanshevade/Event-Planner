'use strict';

/**
 * @ngdoc function
 * @name eventPlannerApp.directive:userPreview
 * @description
 * # userPreview Directive
 * Directive of the eventPlannerApp
 */
angular.module('eventPlannerApp')
  .directive('userPreview', function() {
    return {
      restrict: 'E',
      templateUrl: 'views/partials/userPreview.html',
      replace: true,
      controller: 'UserPreviewCtrl',
      controllerAs: 'userPreview',
      scope: {
        userData: '=',
        usersRef: '=',
        username: '='
      }
    };
});
