/* global define */

define(
	[
		'hackySlides.module',
		'marked',
		'moment'
	], function(app, marked, moment) {
		'use strict';

		return app
			.factory('slidesService', slidesService);

		function slidesService () {
			var edlioIntroSlide = '# Edlio Stand Up Notes\n' +
				moment().format('MMMM, Do, YYYY');

			var firebaseRefDef = {
				getPersonalNoteTemplate: getPersonalNoteTemplate,
				parseMarkdownToSlides: parseMarkdownToSlides,
				buildPresentationSlides: buildPresentationSlides
			};

			function getPersonalNoteTemplate (username) {
				return '# ' + username + '\n' +
					'\n' +
					'## This Week\n' +
					'1. Working on feature 1\n' +
					'2. Fixing bugs for feature 2\n' +
					'3. Assist someone for feature 3\n' +
					'4. Code review for feature 4\n' +
					'\n\n' +
					'## Challenges\n' +
					'1. Waiting the code review for feature 1\n' +
					'2. Researching for something\n' +
					'\n\n' +
					'## Next Week\n' +
					'1. Continue with feature 1\n' +
					'2. Code review for feature 101\n';
			}

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

			function buildPresentationSlides (weeklyNotes) {
				var introSlide = parseMarkdownToSlides(edlioIntroSlide);

				return weeklyNotes
					.reduce(concatSlideNoteToOne, introSlide);

				function concatSlideNoteToOne (
					currentSlides,
					personalWeeklyNote
				) {
					return currentSlides
						.concat(parseMarkdownToSlides(personalWeeklyNote.note));
				}
			}

			return firebaseRefDef;
		}
	}
);