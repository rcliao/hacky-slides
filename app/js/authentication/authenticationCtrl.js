/*global define*/

define(
	[
		'hackySlides.module',
		'./simpleLoginService'
	],
	function (app) {
		'use strict';

		AuthenticationCtrl.$inject =
			[
				'$scope',
				'$log',
				'$timeout',
				'$q',

				'$state',

				'SimpleLoginService'
			];

		return app
			.register
			.controller('AuthenticationCtrl', AuthenticationCtrl);

		function AuthenticationCtrl (
			$scope, $log, $timeout, $q,
			$state,
			SimpleLoginService
		) {
			// if user is already login, redirect to the dashboard
			SimpleLoginService
				.getCurrentUser()
				.then(updateUser);

			$scope.$on(
				'simpleLoginService:notAuthenticatedAsEdlioUser',
				handleNotValidatedEdlioUser
			);

			var vm = this;

			vm.loginAsGoogle = loginAsGoogle;
			vm.loginAsGithub = loginAsGithub;

			function updateUser (user) {
				if (user.$id) {
					redirectToDashboard();
				}
			}

			function loginAsGoogle () {
				SimpleLoginService
					.loginAsGoogle()
					.then(loginSuccess, loginError);
			}

			function loginAsGithub () {
				SimpleLoginService
					.loginAsGithub()
					.then(loginSuccess, loginError);
			}

			/* Helper methods */

			function handleNotValidatedEdlioUser () {
				// cancel the login success timeout event
				if (vm.feedbackId) {
					$timeout.cancel(vm.feedbackId);
				}

				loginError('Sorry, you are not an Edlio member');
			}

			function loginSuccess (user) {
				vm.feedback = 'Welcome, ' + (user.displayName || user.email) +
					'\n' +
					'Redirecting to the dashboard...';

				removeFeedbackLater(2000)
					.then(redirectToDashboard);
			}

			function loginError (error) {
				vm.feedback = 'Failed to login, reason: ' + error;

				removeFeedbackLater(4000);
			}

			function removeFeedbackLater (removeTimer) {
				var deferred = $q.defer();

				vm.loading = false;

				if (vm.feedbackId) {
					$timeout.cancel(vm.feedbackId);
				}

				vm.feedbackId = $timeout(function() {
					vm.feedback = undefined;
					deferred.resolve();
				}, removeTimer);

				return deferred.promise;
			}

			function redirectToDashboard () {
				$state.go('dashboard');
			}
		}
	}
);