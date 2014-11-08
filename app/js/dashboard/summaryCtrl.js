/*global define*/

define(
	[
		'hackySlides.module',
		'moment'
	],
	function (app, moment) {
		'use strict';

		SummaryCtrl.$inject =
			[
				'$scope',
				'$sce',
				'$firebase',
				'firebaseReferenceService',
				'slidesService'
			];

		return app
			.register
			.controller('SummaryCtrl', SummaryCtrl);

		function SummaryCtrl (
			$scope,
			$sce,
			$firebase,
			firebaseReferenceService,
			slidesService
		) {
			var vm = this;

			vm.requestFullScreen = requestFullScreen;
			vm.questions = $firebase(
				firebaseReferenceService
					.lastWeeklyNotes
					.child('questions')
			).$asArray();

			$firebase(
				firebaseReferenceService
					.lastWeeklyNotes
					.child('notes')
			).$asArray()
			.$loaded()
			.then(buildWeeklySlides);


			function buildWeeklySlides (weeklyNotes) {
				vm.weeklyNotes = slidesService
					.buildPresentationSlides(weeklyNotes)
					.map(trustEachSlide);

				function trustEachSlide (slideSection) {
					return {
						slides: slideSection
							.slides
							.map(trustAsHtmlInAngular)
					};
				}

				function trustAsHtmlInAngular (html) {
					return $sce.trustAsHtml(html);
				}
			}

			/**
			 * Request full screen mode for the presentaiton
			 */
			function requestFullScreen () {
				var elem = document.getElementsByClassName("reveal")[0];

				if (elem.requestFullscreen) {
					elem.requestFullscreen();
				} else if (elem.msRequestFullscreen) {
					elem.msRequestFullscreen();
				} else if (elem.mozRequestFullScreen) {
					elem.mozRequestFullScreen();
				} else if (elem.webkitRequestFullscreen) {
					elem.webkitRequestFullscreen();
				}
			}
		}
	}
);/*global define*/
