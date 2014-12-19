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
				'$interval',
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
			$interval,
			$firebase,
			firebaseReferenceService,
			slidesService
		) {
			var vm = this;

			$firebase(
				firebaseReferenceService
					.currentDailyNotes
					.child('notes')
			).$asArray()
			.$loaded()
			.then(buildWeeklySlides);

			vm.currentWeeklyNoteRef = $firebase(
				firebaseReferenceService
					.currentDailyNotes
			);
			vm.currentWeeklyQuestionsRef = $firebase(
				firebaseReferenceService
					.currentDailyNotes
					.child('questions')
			);
			vm.questionMode = 'question';
			vm.currentQuestionKey = undefined;

			// to append a timer div for displaying timer on the top right
			angular.element(document.querySelector('.slides')).ready(
				function() {
					// event.currentSlide, event.indexh, event.indexv
					var timerContainer = angular.element(document.createElement('div'));
					timerContainer.addClass('presentor-timer');

					timerContainer.text('Timer here');

					angular.element(document.querySelector('.reveal'))
						.append(timerContainer);
				}
			);

			vm.requestFullScreen = requestFullScreen;
			vm.onSlideChanged = onSlideChanged;

			/**
			 * Build slides with everyone's notes
			 */
			function buildWeeklySlides (dailyNotes) {
				for (var i = 0; i < dailyNotes.length; i ++) {
					dailyNotes[i].note = '<div class="hidden trigger-start-timer"></div>\n' + dailyNotes[i].note;
					if (i !== dailyNotes.length - 1) {
						dailyNotes[i].note += '\n<div class="upcoming-presentor"><strong>Upcoming</strong> ' + dailyNotes[i+1].$id + '</div>';
					} else {
						dailyNotes[i].note += '\n<div class="upcoming-presentor"><strong>The End</strong></div>';
					}
				}

				vm.dailyNotes = slidesService
					.buildPresentationSlides(dailyNotes)
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

			function secondPassed(timerContainer) {
				var minutes = Math.round((vm.seconds - 30)/60);
				var remainingSeconds = vm.seconds % 60;
				if (remainingSeconds < 10) {
					remainingSeconds = "0" + remainingSeconds;
				}
				timerContainer.text(minutes + ":" + remainingSeconds);
				if (vm.seconds == 0) {
					$interval.cancel(vm.countdownTimer);
				} else {
					vm.seconds--;
				}
			}

			function onSlideChanged (event) {
				// trigger start of the timer
				if (event.currentSlide.innerHTML.indexOf('hidden trigger-start-timer') > -1) {
					var timerContainer = angular.element(document.querySelector('.presentor-timer'));

					vm.seconds = 90;

					if (vm.countdownTimer) {
						$interval.cancel(vm.countdownTimer);
					}

					vm.countdownTimer = $interval(
						function() { secondPassed(timerContainer) },
						1000
					);
				}
			}
		}
	}
);
