/*global define*/

define(
	[
		'hackySlides.module'
	],
	function (app) {
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
			vm.currentWeeklyQuestionsRef = $firebase(
				firebaseReferenceService
					.currentWeeklyNotes
					.child('questions')
			);
			vm.questionMode = 'question';
			vm.currentQuestionKey = undefined;

			vm.addQuestion = addQuestion;
			vm.finishQuestion = finishQuestion;
			vm.addComment = addComment;
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

			function toggleQuestionMode (questionKeyRef) {
				vm.questionMode =
					(vm.questionMode === 'question') ?
						'answers' :
						'question';

				if (questionKeyRef) {
					$firebase(
						vm.currentWeeklyQuestionsRef
							.$ref()
							.child(questionKeyRef)
					).$asObject()
					.$loaded()
					.then(updateCurrentQuestion);
					vm.currentQuestionKey = questionKeyRef;
				}

				function updateCurrentQuestion (question) {
					vm.currentQuestion = question;
				}
			}

			function addQuestion () {
				vm.currentWeeklyQuestionsRef
					.$push(
						vm.question
					)
					.then(updateQuestionIdAndToggleMode);

				function updateQuestionIdAndToggleMode (refValue) {
					vm.question = {};
					toggleQuestionMode(refValue.name());
				}
			}

			function finishQuestion () {
				toggleQuestionMode();
			}

			function addComment () {
				$firebase(
					vm.currentWeeklyQuestionsRef
						.$ref()
						.child(vm.currentQuestionKey)
						.child('comments')
				).$push(
					vm.currentComment
				).then(refreshComment);

				function refreshComment () {
					vm.currentComment = {};
				}
			}

			/**
			 * Request full screen mode for the presentaiton
			 */
			function requestFullScreen () {
				var elem = document.getElementsByClassName('reveal')[0];

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
