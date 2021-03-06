'use strict';

/**
 * @ngdoc overview
 * @name frameworkApp
 * @description
 * # frameworkApp
 *
 * Main module of the application.
 */
angular.module('tinkFramework.controllers',[]);
angular.module('tinkFramework', [
	'tink',
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'tinkFramework.controllers',
  ]).config(function ($routeProvider) { /*, $locationProvider */
		$routeProvider
			.when('/', {
				templateUrl: 'views/main.html'
			})
      .when('/upload', {
        templateUrl: 'views/upload.html',
        controller: 'MainCtrl'
      })
			.when('/datepicker', {
				templateUrl: 'views/datepicker.html',
        controller: 'MainCtrl'
			})
      .when('/forms', {
        templateUrl: 'views/forms.html',
        controller: 'FormsCtrl'
      })
      .when('/callouts', {
        templateUrl: 'views/callouts.html'
      })
      .when('/code', {
        templateUrl: 'views/code.html'
      })
      .when('/popover', {
        templateUrl: 'views/popover.html'
      })
      .when('/panels', {
        templateUrl: 'views/panels.html'
      })
      .when('/grid', {
        templateUrl: 'views/grid.html'
      })
      .when('/sortable-table', {
        templateUrl: 'views/sortable-table.html',
        controller: 'MainCtrl'
      })
      .when('/modal', {
        templateUrl: 'views/modal.html',
        controller: 'ModalCtrl'
      })
      .when('/work-agile-tool', {
        templateUrl: 'views/work-agile-tool.html'
      })
			.when('/:page', {
		    templateUrl: 'views/home.html',
		    controller: 'LocationCtrl'
		  })
			.when('/:page/:subpage', {
		    templateUrl: 'views/home.html',
		    controller: 'LocationCtrl'
		  })
			.otherwise({
				redirectTo: '/'
			});
	});
