/*global define*/

define(
	[
		'hackySlides.module',
		'marked',
		'moment',
		'ace',
		'reveal'
	],
	function (app, marked, moment, ace) {
		'use strict';

		NoteEditorCtrl.$inject =
			[
				'$scope',
				'$sce',
				'$firebase',
				'firebaseReferenceService',
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
			currentUser
		) {
			var vm = this;

			// for keeping reference to the editor
			var _editor = null;

			var currentWeekId = moment().week() + '-' + moment().year();
			var template =
				'# ' + currentUser.displayName + '\n' +
				'\n' +
				'## This Week\n' +
				'    1. Working on feature 1\n' +
				'    2. Fixing bugs for feature 2\n' +
				'    3. Assist someone for feature 3\n' +
				'    4. Code review for feature 4\n' +
				'## Challenges\n' +
				'    1. Waiting the code review for feature 1\n' +
				'    2. Researching for something\n' +
				'## Next Week\n' +
				'    1. Continue with feature 1\n' +
				'    2. Code review for feature 101\n';
			var weeklyNotesRef = firebaseReferenceService
				.weeklyNotes
				.child(currentWeekId);
			var currentWeeklyNoteRef = firebaseReferenceService
				.weeklyNotes
				.child(currentWeekId)
				.child('notes')
				.child(currentUser.displayName);

			// we will get/set the weekly note based onthe week number and year
			var currentWeeklyNoteFirebaseRef = $firebase(currentWeeklyNoteRef);

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

			/**
			 * This function initializes the note when it's not being in the
			 * database before.
			 */
			function initNotes () {
				weeklyNotesRef
					.once('value', initNote);

				currentWeeklyNoteRef
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

			function updateNote (note) {
				vm.personalWeeklyNote = note;
			}

			/**
			 * Simply a wrapper to parse the freemarker and display as html using
			 * Angularjs
			 */
			function parseMarkdown () {
				if (vm.personalWeeklyNote && vm.personalWeeklyNote.note) {
					return $sce.trustAsHtml(marked(vm.personalWeeklyNote.note));
				} else {
					return $sce.trustAsHtml('');
				}
			}

			/**
			 * Ace init function, to grab the editor reference
			 */
			function aceOnLoaded (editor) {
				_editor = editor;
			}

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
		}
	}
);