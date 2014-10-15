/* global define, Reveal */

define(
	[
		'hackySlides.module',
		'reveal',
		'jquery'
	],
	function(app, $) {
		'use strict';

		revealjsPresentation.$inject = ['$timeout'];

		return app
			.directive('revealjsPresentation', revealjsPresentation);

		function revealjsPresentation ($timeout) {
			var directiveDefinition = {
				restrict: 'E',
				templateUrl: 'js/widgets/templates/revealjsSlidesTemplate.html',
				scope: {
					slideSections: '=slideSections'
				},
				link: linkFunction
			};

			return directiveDefinition;

			function linkFunction (scope, element) {

				element.ready(initReveal);

				scope.$watch(
					function() {
						return scope.slideSections;
					},
					function() {
						element.ready(initReveal);
					}
				);

				function initReveal () {
					// Full list of configuration options available here:
					// https://github.com/hakimel/reveal.js#configuration
					Reveal.initialize({
						controls: false,
						progress: false,
						loop: false,
						history: false, // a trick to disable the routing with angular
						fragment: true,
						center: true,
						embedded: true,

						theme: Reveal.getQueryHash().theme, // available themes are in /css/theme
						transition: Reveal.getQueryHash().transition || 'default', // default/cube/page/concave/zoom/linear/fade/none

						// Parallax scrolling
						// parallaxBackgroundImage: 'https://s3.amazonaws.com/hakim-static/reveal-js/reveal-parallax-1.jpg',
						// parallaxBackgroundSize: '2100px 900px',

						// Optional libraries used to extend on reveal.js
						dependencies: [
							{ src: 'libs/reveal.js/lib/js/classList.js', condition: function() { return !document.body.classList; } }
						]
					});
				}
			}
		}
	}
);