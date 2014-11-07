/* global define */

define(
	[
		// angularjs official modules
		'angular',
		'angular-animate',
		'angular-touch',

		// angularjs UI modules
		'angular.ui-router',
		'angular.ui-bootstrap',
		'angular.ui-ace',
		'angular.ui-utils',

		// firebase related modules
		'firebase',
		'angular-firebase',
		'firebase-simple-login',

		// marked
		'marked',

		// custom widgets for semantic ui
		'semanticUiWidgets',
		'semanticUiSideBar',
		'semanticUiDropdown'
	],
	function (angular) {
		'use strict';

		return angular
			.module(
				'HackySlides',
				[
					'ngAnimate',
					'ngTouch',
					'ui.router',
					'ui.bootstrap',
					'ui.ace',
					'ui.keypress',
					'firebase',
					'semanticUi.Widgets'
				]
			).run(['$rootScope', '$state', '$log', function($rootScope, $state, $log) {
				$rootScope.$on('$stateChangeError', function (event, current, previous,
					rejection) {

					$state.go('login');
					$rootScope.criticalErrorReason = rejection;
				});

				$rootScope.$on('$stateChangeSuccess', function() {
					$rootScope.criticalErrorReason = '';
				});
			}]);
	}
);
