/*global define*/

define(
	[
		'hackySlides.module',
		'moment'
	],
	function (app, moment) {
		'use strict';

		PresentationCtrl.$inject =
			[
				'$scope',
				'$sce',
				'$firebase',
				'firebaseReferenceService',
				'slidesService'
			];

		return app
			.register
			.controller('PresentationCtrl', PresentationCtrl);

		function PresentationCtrl (
			$scope,
			$sce,
			$firebase,
			firebaseReferenceService,
			slidesService
		) {
			var vm = this;

			$firebase(
				firebaseReferenceService
					.currentWeeklyNotes
					.child('notes')
			).$asArray()
			.$loaded()
			.then(buildWeeklySlides);

			vm.currentWeeklyNoteRef = $firebase(
				firebaseReferenceService
					.currentWeeklyNotes
			);
			vm.questionMode = 'question';
			vm.currentQuestionId = undefined;

			vm.addQuestion = addQuestion;
			vm.requestFullScreen = requestFullScreen;

			/**
			 * Build slides with everyone's notes
			 */
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

			function toggleQuestionMode () {
				vm.questionMode =
					(vm.questionMode === 'question') ?
						'answers' :
						'question';
			}

			function addQuestion () {
				vm.currentWeeklyNoteRef
					.$push(
						vm.question
					)
					.then(updateQuestionIdAndToggleMode);

				function updateQuestionIdAndToggleMode (value) {
					console.log(value);
					toggleQuestionMode();
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
);