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
				var shuffledNotes = shuffle(weeklyNotes);

				for (var i = 0; i < weeklyNotes.length; i ++) {
					if (i !== weeklyNotes.length - 1) {
						weeklyNotes[i].note += '\n<div class="upcoming-presentor"><strong>Upcoming</strong> ' + weeklyNotes[i+1].$id + '</div>';
					} else {
						weeklyNotes[i].note += '\n<div class="upcoming-presentor"><strong>The End</strong></div>';
					}
				}

				vm.weeklyNotes = slidesService
					.buildPresentationSlides(shuffledNotes)
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


				//+ Jonas Raoni Soares Silva
				//@ http://jsfromhell.com/array/shuffle [v1.0]
				function shuffle(o){ //v1.0
					for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
					return o;
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
