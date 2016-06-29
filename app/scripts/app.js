'use strict';

/**
 * @ngdoc overview
 * @name eventPlannerApp
 * @description
 * # eventPlannerApp
 *
 * Main module of the application.
 */
angular
  .module('eventPlannerApp', [
    'ui.router',
    'firebase',
    'ngMessages',
    'ngTagsInput',
    'ngResource',
    'ngSanitize',
    'ngStorage',
    'ngAria',
    'ngAnimate',
    'ngMaterial',
    'ui.timepicker'
  ])
  .config(function($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise('/welcome');

    $stateProvider
      // new user registration state
      .state('register', {
        url: '/register',
        templateUrl: 'views/register.html',
        data: {
          needLoggedIn: false
        }
      })
      // user login state
      .state('login', {
        url: '/login',
        templateUrl: 'views/login.html',
        data: {
          needLoggedIn: false
        }
      })
      // dashboard
      .state('dashboard', {
        url: '/welcome',
        templateUrl: 'views/dashboard.html',
        data: {
          needLoggedIn: true
        }
      })
      .state('account', {
        url: '/account',
        templateUrl: 'views/account.html',
        data: {
          needLoggedIn: true
        }
      })
      .state('create', {
        url: '/create',
        templateUrl: 'views/create.html',
        data: {
          needLoggedIn: true
        }
      })
      .state('event', {
        url: '/events/:eventID',
        templateUrl: 'views/event.html',
        data: {
          needLoggedIn: true
        }
      })
      .state('event-edit', {
        url: '/events/:eventID/edit',
        templateUrl: 'views/eventEdit.html',
        data: {
          needLoggedIn: true,
          needHostAccess: true
        }
      })
      .state('users', {
        url: '/users',
        templateUrl: 'views/users.html',
        data: {
          needLoggedIn: true
        }
      })
      .state('user', {
        url: '/users/:handle',
        templateUrl: 'views/user.html',
        data: {
          needLoggedIn: true
        }
      })
      ;

    //$locationProvider.html5Mode({enabled: true, requireBase: false});
  })

  // filter for state change
  .run(function($rootScope, $state, $log, usercreds) {
    // when a change in state is started
    $rootScope.$on('$stateChangeStart', function(e, to) {
      var data = to.data;
      // check if data property exists for state
      // check if there is a requirement to be logged in
      // check if the user is logged in from previous session
      if (data && data.needLoggedIn && !usercreds.loggedIn) {
        $log.log('Nope, back to login.');
        $rootScope.loggedIn = false;
        $log.log($rootScope.loggedIn);
        // otherwise, send user to sign in page
        e.preventDefault();
        $state.go('login');
      } else if (data && !data.needLoggedIn && usercreds.loggedIn) {
        $log.log('To the dashboard with you!');
        // otherwise, send user to dashboard
        $rootScope.loggedIn = true;
        $log.log($rootScope.loggedIn);
        e.preventDefault();
        $state.go('dashboard');
      }
    });

});