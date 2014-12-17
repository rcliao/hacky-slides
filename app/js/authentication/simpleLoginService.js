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
			'$firebaseAuth',

			'firebaseReferenceService'
		];

		return app
			.factory('SimpleLoginService', SimpleLoginService);

		function SimpleLoginService (
			$rootScope, $log, $q,
			$state,
			$firebase, $firebaseAuth,
			firebaseReferenceService
		) {

			var ref = firebaseReferenceService.source;
			var existingUserRef = firebaseReferenceService.users;
			var simpleLogin = $firebaseAuth(ref);

			var service = {
				loginAsGithub: loginAsGithub,
				getCurrentUser: getCurrentUser,
				logout: logout
			};

			// when user gets to the page, get the current user from firebase
			var userAuthData = $firebaseAuth(ref)
				.$getAuth();

			$rootScope.$watch(userAuthData, function(userData) {
				if (userAuthData) {
					var userRef = existingUserRef.child(userAuthData.uid);
					$rootScope.user = $firebase(userRef)
						.$asObject();

				}
			});

			// listener to login
			simpleLogin.$onAuth(storeUser);

			return service;

			function getCurrentUser () {
				var deferred = $q.defer();

				var currentUser = $firebaseAuth(ref).$getAuth();

				if (currentUser) {
					deferred.resolve(
						$firebase(
							existingUserRef
								.child(currentUser.uid)
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

			function loginAsGithub () {
				return simpleLogin.$authWithOAuthPopup('github');
			}

			function logout () {
				simpleLogin.$unauth();
				$state.go('login');
			}

			function storeUser (user) {
				if (user) {
					if (!validateUserAsEdlio(user)) {
						$rootScope
							.$broadcast(
								'simpleLoginService:notAuthenticatedAsEdlioUser'
							);
						simpleLogin.$unauth();
					} else {
						$firebase(
							existingUserRef.child(user.uid)
						)
							.$asObject()
							.$loaded()
							.then(function(existingUser) {
								if(!existingUser.displayName) {
									// save new user's profile into Firebase so we can
									// list users, use them in security rules, and show profiles
									$firebase(existingUserRef)
										.$set(
											user.uid,
											{
												displayName: user.github.displayName,
												provider: user.provider,
												email: user.github.email,
												profile: user.github.cachedUserProfile.avatar_url
											}
										);
								}
							});
					}


				} else {

				}
			}

			function validateUserAsEdlio (user) {
				return user.github.cachedUserProfile.company === 'Edlio';

				// Not used but may be used later for the google signin
				// Only if people request for it
				function inWhiteList (email) {
					return $firebase(
						existingUserRef
							.child('whiteLists')
							.child('emails')
					).$asArray()
					.$loaded()
					.then(checkEmails);

					function checkEmails (emails) {
						return emails.some(checkEmail);

						function checkEmail (userEmail) {
							return userEmail.$value === email;
						}
					}
				}

			}
		}
	}
);
