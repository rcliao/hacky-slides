/*global define*/

define(
	[
		'hackySlides.module',

		// providers
		'./services/routeResolverProvider',

		// services
		'./authentication/simpleLoginService',
		'./services/firebaseService'
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

		function routeConfig ($stateProvider, $urlRouterProvider, routeResolver,
			$controllerProvider, $compileProvider, $filterProvider, $provide) {
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
				);
		}
	}
);