/* global require */

require.config({
	paths: {
		// angularjs official stuff
		'angular': '../libs/angular/angular',
		'angular-animate': '../libs/angular-animate/angular-animate',

		// angularjs-ui components
		'angular.ui-router': '../libs/angular-ui-router/release/angular-ui-router',
		'angular.ui-bootstrap': '../libs/angular-bootstrap/ui-bootstrap-tpls',
		'angular.ui-ace': '../libs/angular-ui-ace/ui-ace',

		// firebase
		'angular-firebase': '../libs/angularfire/dist/angularfire',
		'firebase': '../libs/firebase/firebase',
		'firebase-simple-login':
			'../libs/firebase-simple-login/firebase-simple-login',

		// jquery for the semantic
		'jquery': '../libs/jquery/dist/jquery.min',

		// semantic-ui
		'semantic-ui': '../libs/semantic/build/packaged/javascript/semantic',

		// ACE editor
		'ace': '../libs/ace-builds/src-min-noconflict/ace',

		// markdown parser by `marked`
		'marked': '../libs/marked/lib/marked',

		// main app
		'hackySlides.module': 'hackySlides.module',
	},
	shim: {
		'angular': {
			exports: 'angular'
		},
		'angular-animate': {
			deps: ['angular']
		},
		'angular.ui-router': {
			deps: ['angular']
		},
		'angular.ui-bootstrap': {
			deps: ['angular']
		},
		'angular.ui-ace': {
			deps: ['angular', 'ace']
		},
		'angular-firebase': {
			deps: ['angular', 'firebase']
		},
		'firebase': {
			exports: 'Firebase'
		},
		'semantic-ui': {
			deps: ['jquery']
		}
	}
});

require(
	[
		'angular', // used for bootstrapping app

		'hackySlides.module', // main app definition
		'hackySlides.routeConfig'
	],
	function(angular) {
		'use strict';

		angular.bootstrap(document, ['HackySlides']);
	}
);