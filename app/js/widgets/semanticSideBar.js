/* global define */

define(
	[
		'semanticUiWidgets',
		'jquery',
		'semantic-ui'
	],
	function(app, $) {
		'use strict';

		return app
			.directive('semanticSideBar', semanticSideBar);

		function semanticSideBar () {
			var directiveDefinition = {
				restrict: 'A',
				scope: {
					isOpen: '=isOpen'
				},
				link: linkFunction
			};

			return directiveDefinition;

			function linkFunction (scope, element) {
				// initialize the sidebar
				$(element)
					.sidebar();

				// watch for isOpen option
				scope.$watch('isOpen', toggleSideBar);

				function toggleSideBar (value) {
					if (value === true) {
						$(element)
							.sidebar('show');
					} else {
						$(element)
							.sidebar('hide');
					}
				}
			}
		}
	}
);