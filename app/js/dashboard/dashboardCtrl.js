/*global define*/

define(
	[
		'hackySlides.module'
	],
	function (app) {
		'use strict';

		DashboardCtrl.$inject =
			[
				'$scope',
				'SimpleLoginService',
				'currentUser'
			];

		return app
			.register
			.controller('DashboardCtrl', DashboardCtrl);

		function DashboardCtrl (
			$scope,
			SimpleLoginService,
			currentUser
		) {
			var vm = this;

			vm.currentUser = currentUser;
			vm.logout = SimpleLoginService.logout;
		}
	}
);