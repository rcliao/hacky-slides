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
			'$http',

			'$state',

			'$firebase',
			'$firebaseAuth',

			'firebaseReferenceService'
		];

		return app
			.factory('SimpleLoginService', SimpleLoginService);

		function SimpleLoginService (
			$rootScope, $log, $q, $http,
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
				return simpleLogin
					.$authWithOAuthPopup(
						'github',
						{
							remember: 'sessionOnly',
							scope: 'read:org' // read the organization for the authentication purpose
						}
					);
			}

			function logout () {
				simpleLogin.$unauth();
				$state.go('login');
			}

			function storeUser (user) {
				if (user) {
					validateUserAsEdlio(user)
					.then(
						function(response) {
							if (response.status === 200) {
								var userOrganizations = response.data;
								for (var i = 0; i < userOrganizations.length; i ++) {
									if (userOrganizations[i].login.toLowerCase() === 'Edlio'.toLowerCase()) {
										updateUserInfo();
										return true;
									}
								}

								unauthorizedNonEdlioUser();
							} else {
								unauthorizedNonEdlioUser();
							}
						},
						function() {
							unauthorizedNonEdlioUser();
						}
					)
				} else {

				}

				function unauthorizedNonEdlioUser () {
					$rootScope
						.$broadcast(
							'simpleLoginService:notAuthenticatedAsEdlioUser'
						);
					simpleLogin.$unauth();
				}

				function updateUserInfo () {
					// save new user's profile into Firebase so we can
					// list users, use them in security rules, and show profiles
					$firebase(existingUserRef)
						.$set(
							user.uid,
							{
								displayName: user.github.displayName,
								email: (user.github.email || ''),
								profile: (user.github.cachedUserProfile.avatar_url || '')
							}
						);
				}
			}

			function validateUserAsEdlio (user) {
				return $http.get(
					'https://api.github.com/user/orgs',
					{
						headers: {
							'Accept': 'application/vnd.github.moondragon-preview+json',
							'Authorization': 'token ' + user.github.accessToken
						}
					}
				);
			}
		}
	}
);
