'use strict';

/*global angular */
/*
 Directive for jQuery UI timepicker (http://jonthornton.github.io/jquery-timepicker/)

 */
var m = angular.module('ui.timepicker', []);


m.value('uiTimepickerConfig', {
    'step': 15
});

m.directive('uiTimepicker', ['uiTimepickerConfig', '$parse', '$window', 'validateTimes', function(uiTimepickerConfig, $parse, $window, validateTimes) {
    var moment = $window.moment;

    var isAMoment = function(date) {
        return moment !== undefined && moment.isMoment(date) && date.isValid();
    };
    var isDateOrMoment = function(date) {
        return date !== null && (angular.isDate(date) || isAMoment(date));
    };

    return {
        restrict: 'A',
        require: 'ngModel',
        scope: {
            ngModel: '=',
            baseDate: '=',
            uiTimepicker: '=',
            relatedDate: '=',
            earlierThan: '=',
            earlierThanDate: '=',
            laterThan: '=',
            laterThanDate: '=',
        },
        priority: 1,
        link: function(scope, element, attrs, ngModel) {
            var config = angular.copy(uiTimepickerConfig);
            var asMoment = config.asMoment || false;
            delete config.asMoment;

            ngModel.$render = function() {
                var modelDate = ngModel.$modelValue;
                if (!angular.isDefined(modelDate)) {
                    return;
                }
                if (modelDate !== null && modelDate !== '' && !isDateOrMoment(modelDate)) {
                    throw new Error('ng-Model value must be a Date or Moment object - currently it is a ' + typeof modelDate + '.');
                }
                if (isAMoment(modelDate)) {
                    modelDate = modelDate.toDate();
                }
                if (!element.is(':focus') && !invalidInput()) {
                    element.timepicker('setTime', modelDate);
                }
                if(modelDate === null){
                    resetInput();
                }

                if (scope.earlierThan &&
                    scope.earlierThanDate &&
                    scope.relatedDate) {
                    switch (validateTimes.compare(scope.relatedDate, scope.earlierThanDate)) {
                        case 'later':
                            //ngModel.$setValidity('earlierThan', false);
                            break;
                        case 'same':
                            if (validateTimes.compare(ngModel.$modelValue, scope.earlierThan) === 'earlier') {
                                ngModel.$setValidity('earlierThan', true);
                            } else {
                                ngModel.$setValidity('earlierThan', false);
                            }
                            break;
                        case 'earlier':
                            ngModel.$setValidity('earlierThan', true);
                            break;
                    }
                }

                if (scope.laterThan &&
                    scope.laterThanDate &&
                    scope.relatedDate) {
                    switch (validateTimes.compare(scope.relatedDate, scope.laterThanDate)) {
                        case 'earlier':
                            //ngModel.$setValidity('laterThan', false);
                            break;
                        case 'same':
                            if (validateTimes.compare(ngModel.$modelValue, scope.laterThan) === 'later') {
                                ngModel.$setValidity('laterThan', true);
                            } else {
                                ngModel.$setValidity('laterThan', false);
                            }
                            break;
                        case 'later':
                            ngModel.$setValidity('laterThan', true);
                            break;
                    }
                }

            };

            scope.$watchCollection('[ngModel, relatedDate, laterThanDate, earlierThanDate, laterThan, earlierThan]', function() {
                ngModel.$render();
            }, true);

            config.appendTo = config.appendTo || element.parent();

            element.timepicker(
                angular.extend(
                    config, scope.uiTimepicker ?
                        scope.uiTimepicker :
                        {}
                )
            );

            var resetInput = function(){
                element.timepicker('setTime', null);
            };

            var userInput = function() {
                return element.val().trim();
            };

            var invalidInput = function() {
                return userInput() && ngModel.$modelValue === null;
            };

            element.on('$destroy', function() {
                element.timepicker('remove');
            });

            var asDate = function() {
                var baseDate = ngModel.$modelValue ? ngModel.$modelValue : scope.baseDate;
                return isAMoment(baseDate) ? baseDate.toDate() : baseDate;
            };

            var asMomentOrDate = function(date) {
                return asMoment ? moment(date) : date;
            };

            if (element.is('input')) {
                ngModel.$parsers.unshift(function() {
                    var date = element.timepicker('getTime', asDate());
                    return date ? asMomentOrDate(date) : date;
                });
                ngModel.$validators.time = function(modelValue) {
                    return (!attrs.required && !userInput()) ? true : isDateOrMoment(modelValue);
                };
            } else {
                element.on('changeTime', function() {
                    scope.$evalAsync(function() {
                        var date = element.timepicker('getTime', asDate());
                        ngModel.$setViewValue(date);
                    });
                });
            }
        }
    };
}]);
