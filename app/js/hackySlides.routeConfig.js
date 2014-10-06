/*global define*/

define(
	[
		'hackySlides.module',

		// providers
		'./services/routeResolverProvider',

		// services
		'./authentication/simpleLoginService',
		'./services/firebaseReferenceService',
	],
	function(app) {
		'use strict';

		routeConfig.$inject = [
			'$stateProvider',
			'$urlRouterProvider',
			'routeResolverProvider',
			'$controllerProvider',
			'$compileProvider',
			'$filterProvider',
			'$provide'
		];

		return app
			.config(routeConfig);

		function routeConfig (
			$stateProvider,
			$urlRouterProvider,
			routeResolver,
			$controllerProvider,
			$compileProvider,
			$filterProvider,
			$provide
		) {

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
					'dashboard.noteEditor',
					{
						url: '/note/editor',
						templateUrl: 'partials/notes/noteEditor.html'
					}
				);
		}
	}
);