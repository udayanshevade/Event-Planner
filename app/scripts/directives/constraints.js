'use strict';

var eventPlannerApp = angular.module('eventPlannerApp');


/**
 * @ngdoc function
 * @name eventPlannerApp.directive: passwordMatch
 * @description
 * # Constraints Validation
 * Directive of the eventPlannerApp
 */
eventPlannerApp.directive('passwordMatch', function() {
    return {
      restrict: 'A',
      require: 'ngModel',
      scope: {
        password: '@passwordMatch'
      },
      link: function(scope, element, attr, ctrl) {
        ctrl.$validators.passwordMatch = function(modelValue, viewValue) {
          if (ctrl.$isEmpty(modelValue)) {
            return true;
          } else if (scope.password === viewValue) {
            return true;
          }
          return false;
        };
      }
    };

});


/**
 * @ngdoc function
 * @name eventPlannerApp.directive: newUser
 * @description
 * # Constraints Validation
 * Directive of the eventPlannerApp
 * Attribution: https://github.com/princejwesley/angular-constraints
 */
eventPlannerApp.directive('newUser', function() {
    return {
      restrict: 'A',
      require: 'ngModel',
      scope: {
        checkUsers: '&newUser'
      },
      link: function(scope, element, attr, ctrl) {
        ctrl.$validators.newUser = function(modelValue, viewValue) {
          if (ctrl.$isEmpty(modelValue)) {
            return true;
          } else {
            return !scope.checkUsers({ un: viewValue });
          }
        };
      }
    };

});


/**
 * @ngdoc function
 * @name eventPlannerApp.directive: validRef
 * @description
 * # Constraints Validation
 * Directive of the eventPlannerApp
 * Attribution: https://github.com/princejwesley/angular-constraints
 */
eventPlannerApp.directive('validRef', function() {

    // cannot be . $ # [ ] / or 1-30 or 127

    function isValidKey(text) {
      return typeof text === 'string' &&
        text.length &&
        !text.match(/[.$\[\]#\/]/);
    }

    return {
      restrict: 'A',
      require: 'ngModel',
      link: function(scope, element, attr, ctrl) {
        ctrl.$validators.validRef = function(modelValue, viewValue) {
          if (ctrl.$isEmpty(modelValue)) {
            return true;
          } else {
            return isValidKey(viewValue);
          }
        };
      }
    };

});



/**
 * @ngdoc function
 * @name eventPlannerApp.directive: validRef
 * @description
 * # Constraints Validation
 * Directive of the eventPlannerApp
 * Attribution: https://github.com/princejwesley/angular-constraints
 */
eventPlannerApp.directive('hasNum', function() {

    // cannot be . $ # [ ] / or 1-30 or 127

    function hasNum(text) {
      return /\d/.test(text);
    }

    return {
      restrict: 'A',
      require: 'ngModel',
      link: function(scope, element, attr, ctrl) {
        ctrl.$validators.hasNum = function(modelValue, viewValue) {
          if (ctrl.$isEmpty(modelValue)) {
            return true;
          } else {
            return hasNum(viewValue);
          }
        };
      }
    };

});



/**
 * @ngdoc function
 * @name eventPlannerApp.directive: hasUpperCase
 * @description
 * # Constraints Validation
 * Directive of the eventPlannerApp
 * Attribution: https://github.com/princejwesley/angular-constraints
 */
eventPlannerApp.directive('hasUpperCase', function() {

    // cannot be . $ # [ ] / or 1-30 or 127

    function hasUpperCase(text) {
      return (text.toLowerCase() !== text);
    }

    return {
      restrict: 'A',
      require: 'ngModel',
      link: function(scope, element, attr, ctrl) {
        ctrl.$validators.hasUpperCase = function(modelValue, viewValue) {
          if (ctrl.$isEmpty(modelValue)) {
            return true;
          } else {
            return hasUpperCase(viewValue);
          }
        };
      }
    };

});



/**
 * @ngdoc function
 * @name eventPlannerApp.directive: hasLowerCase
 * @description
 * # Constraints Validation
 * Directive of the eventPlannerApp
 * Attribution: https://github.com/princejwesley/angular-constraints
 */
eventPlannerApp.directive('hasLowerCase', function() {

    // cannot be . $ # [ ] / or 1-30 or 127

    function hasLowerCase(text) {
      return (text.toUpperCase() !== text);
    }

    return {
      restrict: 'A',
      require: 'ngModel',
      link: function(scope, element, attr, ctrl) {
        ctrl.$validators.hasLowerCase = function(modelValue, viewValue) {
          if (ctrl.$isEmpty(modelValue)) {
            return true;
          } else {
            return hasLowerCase(viewValue);
          }
        };
      }
    };

});