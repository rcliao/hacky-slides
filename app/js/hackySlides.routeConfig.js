/*global define*/

define(
	[
		'hackySlides.module',

		// providers
		'./services/routeResolverProvider',

		// services
		'./authentication/simpleLoginService',
		'./services/firebaseReferenceService',
		'./services/slidesService',

		// directives
		'revealjsSlides'
	],
	function(app) {
		'use strict';

		routeConfig.$inject = [
			'$stateProvider',
			'$urlRouterProvider',
			'$locationProvider',
			'$controllerProvider',
			'$compileProvider',
			'$filterProvider',
			'$provide',
			'routeResolverProvider'
		];

		return app
			.config(routeConfig);

		function routeConfig (
			$stateProvider,
			$urlRouterProvider,
			$locationProvider,
			$controllerProvider,
			$compileProvider,
			$filterProvider,
			$provide,
			routeResolver
		) {

			getCurrentUser.$inject = ['SimpleLoginService'];

			// using register to tell angularjs to load and register in run time
			app.register =
			{
				controller: $controllerProvider.register,
				directive: $compileProvider.directive,
				filter: $filterProvider.register,
				factory: $provide.factory,
				service: $provide.service
			};

			$urlRouterProvider.otherwise('/login');

			$stateProvider
				.state(
					'login',
					{
						url: '/login',
						templateUrl: 'partials/authentication/login.html',
						controller: 'AuthenticationCtrl as authentication',
						resolve: {
							resolveRouteCtrl: routeResolver
								.route
								.resolve(
									[
										'./authentication/authenticationCtrl'
									]
								)
						}
					}
				)
				.state(
					'dashboard',
					{
						url: '/dashboard',
						templateUrl: 'partials/dashboard/dashboard.html',
						controller: 'DashboardCtrl as dashboard',
						resolve: {
							currentUser: getCurrentUser,
							resolveRouteCtrl: routeResolver
								.route
								.resolve(
									[
										'./dashboard/dashboardCtrl'
									]
								)
						}
					}
				)
				.state(
					'dashboard.summary',
					{
						url: 'summary',
						templateUrl: 'partials/dashboard/summary.html',
						controller: 'SummaryCtrl as summary',
						resolve: {
							resolveRouteCtrl: routeResolver
								.route
								.resolve(
									[
										'./dashboard/summaryCtrl'
									]
								)
						}
					}
				)
				.state(
					'presentation',
					{
						url: '/presentation/:id',
						templateUrl: 'partials/presentation/presentation.html',
						controller: 'PresentationCtrl as presentation',
						resolve: {
							resolveRouteCtrl: routeResolver
								.route
								.resolve(
									[
										'./presentation/presentationCtrl'
									]
								)
						}
					}
				)
				.state(
					'dashboard.noteEditor',
					{
						url: '/note/editor',
						templateUrl: 'partials/notes/noteEditor.html',
						controller: 'NoteEditorCtrl as noteEditor',
						resolve: {
							resolveRouteCtrl: routeResolver
								.route
								.resolve(
									[
										'./note/noteEditorCtrl'
									]
								)
						}
					}
				);

			function getCurrentUser (SimpleLoginService) {
				return SimpleLoginService.getCurrentUser();
			}
		}
	}
);