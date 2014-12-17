/*global define*/

define(
	[
		'hackySlides.module',
		'marked',
		'moment',
		'ace'
	],
	function (app, marked, moment, ace) {
		'use strict';

		NoteEditorCtrl.$inject =
			[
				'$scope',
				'$sce',
				'$firebase',
				'firebaseReferenceService',
				'slidesService',
				'currentUser'
			];

		return app
			.register
			.controller('NoteEditorCtrl', NoteEditorCtrl);

		function NoteEditorCtrl (
			$scope,
			$sce,
			$firebase,
			firebaseReferenceService,
			slidesService,
			currentUser
		) {
			var vm = this;

			// for keeping reference to the editor
			var _editor = null;

			// we will get/set the weekly note based onthe week number and year
			var currentWeekId = moment().day() + '-' + moment().week() + '-' + moment().year();
			var template = slidesService
				.getPersonalNoteTemplate(currentUser.displayName);
			var currentDailyNotes = firebaseReferenceService
				.currentDailyNotes;
			var personalDailyNotes = firebaseReferenceService
				.getPersonalDailyNotes(currentUser.displayName);
			var currentWeeklyNoteFirebaseRef = $firebase(personalDailyNotes);

			$scope.$watch(
				function() {
					if (vm.personalDailyNotes) {
						return vm.personalDailyNotes.note;
					} else {
						return '';
					}
				},
				parseMarkdownToSlides
			);

			vm.vimMode = false;
			vm.previewMode = 'html';

			// preprocessors
			currentWeeklyNoteFirebaseRef
				.$asObject()
				.$loaded(updateNote);
			initNotes();

			// functions
			vm.parseMarkdown = parseMarkdown;
			vm.aceOnLoaded = aceOnLoaded;
			vm.aceOnChange = aceOnChange;
			vm.toggleVimMode = toggleVimMode;
			vm.requestFullscreen = requestFullscreen;

			/**
			 * This function initializes the note when it's not being in the
			 * database before.
			 */
			function initNotes () {
				currentDailyNotes
					.once('value', initNote);

				personalDailyNotes
					.once('value', initPersonalNote);

				// if there is no note for this week, create one
				function initNote (value) {
					if (value.val() === undefined || value.val() === null) {
						$firebase(
							firebaseReferenceService
								.weeklyNotes
						).$set(
							currentWeekId,
							{
								currentSlide: 0,
								notes: []
							}
						);
					}
				}

				// if there is no personal note yet, init with the template
				function initPersonalNote (value) {
					if (value.val() === null) {
						$firebase(
							firebaseReferenceService
								.weeklyNotes
								.child(currentWeekId)
								.child('notes')
						)
						.$set(
							currentUser.displayName,
							{
								note: template
							}
						);
					}
				}
			}

			/**
			 * A simple method to update the current view value from the firebase
			 * return value
			 */
			function updateNote (note) {
				vm.personalDailyNotes = note;
			}

			/**
			 * Simply a wrapper to parse the freemarker and display as html using
			 * Angularjs
			 */
			function parseMarkdown () {
				if (vm.personalDailyNotes && vm.personalDailyNotes.note) {
					return $sce.trustAsHtml(marked(vm.personalDailyNotes.note));
				} else {
					return $sce.trustAsHtml('');
				}
			}

			/**
			 * In addition to parse to html, in order to display this html in
			 * AngularJS, we need to set this html as the trusted source by using
			 * $sce, this method will trust all the html.
			 */
			function parseMarkdownToSlides (newNoteValue) {
				if (newNoteValue) {
					vm.slideSections = slidesService
						.parseMarkdownToSlides(newNoteValue)
						.map(trustEachSlide);
				} else {
					vm.slideSections = [];
				}

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
			 * Ace init function, to grab the editor reference
			 */
			function aceOnLoaded (editor) {
				_editor = editor;
			}

			/**
			 * Manually set/store the value of user's note to firebase on every
			 * change event by ace editor
			 */
			function aceOnChange (event) {
				currentWeeklyNoteFirebaseRef
					.$set(
						'note',
						_editor.getSession().getValue()
					);
			}

			/**
			 * Toggle the vim mode in the ace editor
			 */
			function toggleVimMode () {
				vm.vimMode = !vm.vimMode;

				if (vm.vimMode) {
					_editor.setKeyboardHandler('ace/keyboard/vim');
				} else {
					_editor.setKeyboardHandler(null);
				}

				_editor.focus();
			}

			/**
			 * Request full screen mode for the presentaiton
			 */
			function requestFullscreen () {
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
