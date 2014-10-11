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

		// firebase related modules
		'firebase',
		'angular-firebase',
		'firebase-simple-login',

		// marked
		'marked',

		// custom widgets for semantic ui
		'semanticUiWidgets',
		'semanticUiSideBar'
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
					'firebase',
					'semanticUi.Widgets'
				]
			);
	}
);