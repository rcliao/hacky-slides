/* global define */

define(
	[
		// angularjs official modules
		'angular',
		'angular-animate',

		// angularjs UI modules
		'angular.ui-router',
		'angular.ui-bootstrap',
		'angular.ui-ace',

		// firebase related modules
		'firebase',
		'angular-firebase',
		'firebase-simple-login'
	],
	function (angular) {
		'use strict';

		return angular
			.module(
				'HackySlides',
				[
					'ngAnimate',
					'ui.router',
					'ui.bootstrap',
					'ui.ace',
					'firebase'
				]
			);
	}
);