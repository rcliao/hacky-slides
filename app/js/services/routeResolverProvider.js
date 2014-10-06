/* global define */

define(
	[
		'hackySlides.module'
	], function(app) {
		return app.provider('routeResolver', routeResolver);

		function routeResolver () {
			this.$get = function() {
				return this;
			};

			this.route = {
				resolve: resolve
			};

			function resolve (dependencies) {
				loadRouteCtrl.$inject = ['$q', '$rootScope'];

				return loadRouteCtrl;

				function loadRouteCtrl ($q, $rootScope) {
					var deferred = $q.defer();

					require(
						dependencies,
						function() {
							deferred.resolve();
						},
						function(error) {
							deferred.reject(error);
						}
					);

					return deferred.promise;
				}
			}
		}
	}
);