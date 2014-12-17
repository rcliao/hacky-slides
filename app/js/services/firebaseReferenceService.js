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
			var todayId = moment().day() + '-' + moment().week() + '-' + moment().year();
			var lastWeekId = (moment().week()-1) + '-' + moment().year();
			var yesterdayId = (moment().day() === 1) ?
				'5-' + (moment().week()-1) + '-' + moment().year() :
				(moment().day()-1) + '-' + moment().week() + '-' + moment().year();

			var firebaseRefDef = {
				source: source,
				users: source.child('users'),
				weeklyNotes: weeklyNotes,
				currentDailyNotes: weeklyNotes.child(todayId),
				lastWeeklyNotes: weeklyNotes.child(lastWeekId),
				yesterdayNotes: weeklyNotes.child(yesterdayId),
				getPersonalDailyNotes: getPersonalDailyNotes
			}

			function getPersonalDailyNotes (username) {
				return weeklyNotes
					.child(todayId)
					.child('notes')
					.child(username);
			}

			return firebaseRefDef;
		}
	}
);
