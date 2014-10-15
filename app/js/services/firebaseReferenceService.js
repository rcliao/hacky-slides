/* global define, Firebase */

define(
	[
		'hackySlides.module',
		'moment',
		'firebase'
	], function(app, moment) {
		return app.factory('firebaseReferenceService', firebaseReferenceService)

		function firebaseReferenceService () {
			var source = new Firebase('https://hacky-slides.firebaseio.com/');
			var weeklyNotes = source.child('weeklyNotes');
			var currentWeekId = moment().week() + '-' + moment().year();

			var firebaseRefDef = {
				source: source,
				users: source.child('users'),
				weeklyNotes: weeklyNotes,
				currentWeeklyNotes: weeklyNotes.child(currentWeekId),
				getPersonalWeeklyNote: getPersonalWeeklyNote
			}

			function getPersonalWeeklyNote (username) {
				return weeklyNotes
					.child(currentWeekId)
					.child('notes')
					.child(username);
			}

			return firebaseRefDef;
		}
	}
);