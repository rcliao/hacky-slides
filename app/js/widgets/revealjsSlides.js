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

				scope.$on('$destroy', function() {
					// need to reset the reveal events or we get errors
					Reveal.removeEventListeners();
				});

				function initReveal () {
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

					updateRandomBackgroundImage();

					addTimerDOM();
				}

				function updateRandomBackgroundImage () {
					var randomBackgroundUrl = '';

					var backgroundImages = [
						'img/bridge_raining.gif',
						'img/castle.gif',
						'img/dawn.gif',
						'img/et.gif',
						'img/falls.gif',
						'img/nature.gif',
						'img/northlights.gif',
						'img/pixelphony_2.gif',
						'img/watchdogs.gif'
					];

					randomBackgroundUrl = backgroundImages[Math.floor(Math.random() * 9)];

					angular.element(
						document.querySelector('.reveal')
					).css(
						{
							'background-image': 'url(' + randomBackgroundUrl + ')'
						}
					);
				}

				function addTimerDOM () {
					// event.currentSlide, event.indexh, event.indexv
					var timerContainer = angular.element(document.createElement('div'));
					timerContainer.addClass('presentor-timer');

					timerContainer.text('Timer here');

					angular.element(document.querySelector('.reveal'))
						.append(timerContainer);
				}
			}
		}
	}
);
