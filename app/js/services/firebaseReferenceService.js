/* global define, Firebase */

define(
	[
		'hackySlides.module',
		'firebase'
	], function(app) {
		return app.factory('firebaseReferenceService', firebaseReferenceService)

		function firebaseReferenceService () {
			var source = new Firebase('https://hacky-slides.firebaseio.com/');

			var firebaseRefDef = {
				source: source,
				users: source.child('users'),
				weeklyNotes: source.child('weeklyNotes')
			}

			return firebaseRefDef;
		}
	}
);