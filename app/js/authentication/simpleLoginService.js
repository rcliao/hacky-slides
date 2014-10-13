/*global define*/

define(
	[
		'hackySlides.module',
		'firebase'
	],
	function (app) {
		'use strict';

		SimpleLoginService.$inject = [
			'$rootScope',
			'$log',
			'$q',

			'$state',

			'$firebase',
			'$firebaseSimpleLogin',

			'firebaseReferenceService'
		];

		return app
			.factory('SimpleLoginService', SimpleLoginService);

		function SimpleLoginService (
			$rootScope, $log, $q,
			$state,
			$firebase, $firebaseSimpleLogin,
			firebaseReferenceService
		) {

			var ref = firebaseReferenceService.source;
			var existingUserRef = firebaseReferenceService.users;
			var simpleLogin = $firebaseSimpleLogin(ref);

			var service = {
				loginAsGoogle: loginAsGoogle,
				loginAsGithub: loginAsGithub,
				getCurrentUser: getCurrentUser,
				logout: logout
			};

			// when user gets to the page, get the current user from firebase
			$firebaseSimpleLogin(ref)
				.$getCurrentUser()
				.then(updateUser);

			// listener to login
			$rootScope.$on('$firebaseSimpleLogin:login', storeUser);

			return service;

			function getCurrentUser () {
				return simpleLogin.$getCurrentUser()
					.then(getUserFromDatabase);

				function getUserFromDatabase (user) {
					var deferred = $q.defer();

					if (user) {
						deferred.resolve(
							$firebase(
								existingUserRef
									.child(user.id)
							)
							.$asObject()
							.$loaded()
							.then(returnUserObject)
						);
					} else {
						deferred.reject('Failed to find user in database.');
					}

					return deferred.promise;

					function returnUserObject (user) {
						return user;
					}
				}
			}

			function loginAsGoogle () {
				return simpleLogin.$login('google');
			}

			function loginAsGithub () {
				return simpleLogin.$login('github');
			}

			function logout () {
				simpleLogin.$logout();
				$state.go('login');
			}

			// update the rootscope user based on the current user in firebase
			function updateUser (user) {
				if(user) {
					var userRef = existingUserRef.child(user.id);

					$rootScope.user = $firebase(userRef)
						.$asObject();
				}
			}

			function storeUser (event, user) {
				if (event) {
					// TODO: add handler here
				}
				if (user) {
					if (!validateUserAsEdlio(user)) {
						$rootScope
							.$broadcast(
								'simpleLoginService:notAuthenticatedAsEdlioUser'
							);
					}

					$firebase(
						existingUserRef.child(user.id)
					)
						.$asObject()
						.$loaded()
						.then(function(existingUser) {
							if(!existingUser.displayName) {
								// save new user's profile into Firebase so we can
								// list users, use them in security rules, and show profiles
								$firebase(existingUserRef)
									.$set(
										user.id,
										{
											displayName: user.displayName,
											provider: user.provider,
											email: user.email
										}
									);
							}
						});

				} else {
					$log.error('wtf');
				}
			}

			function validateUserAsEdlio (user) {
				switch (user.provider) {
					case 'google':
						return user.thirdPartyUserData.hd === 'edlio.com';
					case 'github':
						return user.thirdPartyUserData.emails.some(validateEdlioEmail);
				}

				function validateEdlioEmail (emailObj) {
					return endsWith(emailObj.email, '@edlio.com');
				}
			}

			function endsWith(str, suffix) {
				return str.indexOf(suffix, str.length - suffix.length) !== -1;
			}
		}
	}
);