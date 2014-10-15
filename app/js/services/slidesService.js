/* global define */

define(
	[
		'hackySlides.module',
		'marked'
	], function(app, marked) {
		'use strict';

		return app
			.factory('slidesService', slidesService);

		function slidesService () {
			var firebaseRefDef = {
				parseMarkdownToSlides: parseMarkdownToSlides
			};

			function parseMarkdownToSlides (markdownText) {
				return markdownText
					.split('\n\n\n\n')
					.map(splitToSlides);

				function splitToSlides (slideSection) {
					var slideSectionContainer = {};

					slideSectionContainer.slides = slideSection
						.split('\n\n\n')
						.map(parseMarkdownToHtml);

					return slideSectionContainer;
				}

				function parseMarkdownToHtml (markdown) {
					return marked(markdown);
				}
			}

			return firebaseRefDef;
		}
	}
);