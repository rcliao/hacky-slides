/* global require */

require.config({
	urlArgs: "bust=" +  (new Date()).getTime(),
	paths: {
		// angularjs official stuff
		'angular': '../libs/angular/angular',
		'angular-animate': '../libs/angular-animate/angular-animate',
		'angular-touch': '../libs/angular-touch/angular-touch',

		// angularjs-ui components
		'angular.ui-router': '../libs/angular-ui-router/release/angular-ui-router',
		'angular.ui-bootstrap': '../libs/angular-bootstrap/ui-bootstrap-tpls',
		'angular.ui-ace': '../libs/angular-ui-ace/ui-ace',
		'angular.ui-utils': '../libs/angular-ui-utils/ui-utils',

		// firebase
		'angular-firebase': '../libs/angularfire/dist/angularfire',
		'firebase': '../libs/firebase/firebase',
		'firebase-simple-login':
			'../libs/firebase-simple-login/firebase-simple-login',

		// jquery for the semantic
		'jquery': '../libs/jquery/dist/jquery.min',

		// semantic-ui
		'semantic-ui': '../libs/semantic-ui/dist/semantic.min',

		// ACE editor
		'ace': '../libs/ace-builds/src-min-noconflict/ace',
		'ace.keybinding-vim': '../libs/ace-builds/src-min-noconflict/keybinding-vim',

		// markdown parser by `marked`
		'marked': '../libs/marked/lib/marked',

		// moment.js
		'moment': '../libs/moment/moment',

		// revealjs for slides presentaiton
		'reveal': '../libs/reveal.js/js/reveal',
		'reveal-head': '../libs/reveal.js/lib/js/head.min',

		// custom modules
		'semanticUiWidgets': 'widgets/semanticUiWidgets.module',
		'semanticUiSideBar': 'widgets/semanticSideBar',
		'semanticUiDropdown': 'widgets/semanticDropdown',
		'revealjsSlides': 'widgets/revealjsSlides',

		'hackySlides.module': 'hackySlides.module'
	},
	shim: {
		'angular': {
			exports: 'angular'
		},
		'angular-animate': {
			deps: ['angular']
		},
		'angular-touch': {
			deps: ['angular']
		},
		'angular.ui-router': {
			deps: ['angular']
		},
		'angular.ui-bootstrap': {
			deps: ['angular']
		},
		'angular.ui-ace': {
			deps: ['angular', 'ace', 'ace.keybinding-vim']
		},
		'angular.ui-utils': {
			deps: ['angular']
		},
		'angular-firebase': {
			deps: ['angular', 'firebase']
		},
		'firebase': {
			exports: 'Firebase'
		},
		'semantic-ui': {
			deps: ['jquery']
		},
		'ace.keybinding-vim': {
			deps: ['ace']
		},
		'reveal': {
			exports: 'Reveal',
			deps: ['reveal-head']
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
