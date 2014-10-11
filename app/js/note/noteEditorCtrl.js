/*global define*/

define(
	[
		'hackySlides.module',
		'marked'
	],
	function (app, marked) {
		'use strict';

		NoteEditorCtrl.$inject =
			[
				'$scope',
				'$sce'
			];

		return app
			.register
			.controller('NoteEditorCtrl', NoteEditorCtrl);

		function NoteEditorCtrl (
			$scope,
			$sce
		) {
			var vm = this;

			// for keeping reference to the editor
			var _editor = null;

			vm.parseMarkdown = parseMarkdown;
			vm.aceOnLoaded = aceOnLoaded;
			vm.toggleVimMode = toggleVimMode;
			vm.vimMode = false;

			function parseMarkdown () {
				if (vm.note) {
					return $sce.trustAsHtml(marked(vm.note));
				} else {
					return $sce.trustAsHtml('');
				}
			}

			function aceOnLoaded (editor) {
				_editor = editor;
				_editor.setKeyboardHandler('ace/keyboard/vim');
				_editor.setKeyboardHandler('');
			}

			function toggleVimMode () {
				vm.vimMode = !vm.vimMode;

				if (vm.vimMode) {
					_editor.setKeyboardHandler('ace/keyboard/vim');
				} else {
					// empty string means default keyboard binding
					_editor.setKeyboardHandler('');
				}
			}
		}
	}
);