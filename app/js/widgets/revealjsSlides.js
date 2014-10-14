/* global define, Reveal */

define(
	[
		'hackySlides.module',
		'reveal'
	],
	function(app) {
		'use strict';

		return app
			.directive('revealjsSlides', revealjsSlides);

		function revealjsSlides () {
			var directiveDefinition = {
				restrict: 'E',
				templateUrl: 'js/widgets/templates/revealjsSlidesTemplate.html',
				link: linkFunction
			};

			return directiveDefinition;

			function linkFunction (scope, element) {

				// Full list of configuration options available here:
				// https://github.com/hakimel/reveal.js#configuration
				Reveal.initialize({
					controls: true,
					progress: true,
					history: false, // a trick to disable the routing with angular
					center: true,
					loop: false,
					embedded: true,

					theme: Reveal.getQueryHash().theme, // available themes are in /css/theme
					transition: Reveal.getQueryHash().transition || 'default', // default/cube/page/concave/zoom/linear/fade/none

					// Parallax scrolling
					// parallaxBackgroundImage: 'https://s3.amazonaws.com/hakim-static/reveal-js/reveal-parallax-1.jpg',
					// parallaxBackgroundSize: '2100px 900px',

					// Optional libraries used to extend on reveal.js
					dependencies: [
						{ src: 'libs/reveal.js/plugin/markdown/marked.js', condition: function() { return !!document.querySelector( '[data-markdown]' ); } },
						{ src: 'libs/reveal.js/plugin/markdown/markdown.js', condition: function() { return !!document.querySelector( '[data-markdown]' ); } }
					]
				});
			}
		}
	}
);