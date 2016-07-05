'use strict';

/**
 * @ngdoc function
 * @name eventPlannerApp.directive: autofocus
 * @description
 * # Focuses automatically on element when the template is loaded
 * Directive of the eventPlannerApp
 */
angular
    .module('eventPlannerApp')
    .directive('ngAutofocus', function($timeout) {
        return {
            link: function(scope, element) {
                $timeout(function() {
                    element.focus();
                });
            }
        };
    });