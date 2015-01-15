/* global define, Reveal */

define(
	[
		'hackySlides.module',
		'reveal'
	],
	function(app) {
		'use strict';

		revealjsPresentation.$inject = ['$timeout'];

		return app
			.directive('revealjsPresentation', revealjsPresentation);

		function revealjsPresentation ($timeout) {
			var directiveDefinition = {
				restrict: 'E',
				templateUrl: 'js/widgets/templates/revealjsSlidesTemplate.html',
				scope: {
					slideSections: '=slideSections',
					slideChangeEvent: '&'
				},
				link: linkFunction
			};

			return directiveDefinition;

			function linkFunction (scope, element) {

				if (element.length > 0) {
					element
						.ready(initReveal);
				}

				scope.$watch(
					function() {
						return scope.slideSections;
					},
					function() {
						if (scope.slideSections && element.length > 0) {
							element
								.ready(initReveal);
						}
					}
				);

				function initReveal () {
					$timeout(function() {
						// Full list of configuration options available here:
						// https://github.com/hakimel/reveal.js#configuration
						Reveal.initialize({
							controls: true,
							progress: true,
							loop: false,
							history: false, // a trick to disable the routing with angular
							fragment: true,
							center: true,
							embedded: true,

							theme: 'default', // available themes are in /css/theme
							transition: (typeof window.orientation !== 'undefined') ? 'none' : 'default', // default/cube/page/concave/zoom/linear/fade/none

							// Optional libraries used to extend on reveal.js
							dependencies: [
								{ src: 'libs/reveal.js/lib/js/classList.js', condition: function() { return !document.body.classList; } }
							]
						});

						Reveal.addEventListener('slidechanged', function(event) {
							scope.slideChangeEvent({'event': event});
						});
					});
				}
			}
		}
	}
);
