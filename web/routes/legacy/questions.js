var Arrow = require('arrow');

var utils = require('../../../lib/utils');

module.exports = Arrow.Router.extend({
	name: __filename,

	// /questions/tag/iphone/
	// /questions/tag/iphone
	// /questions/tag/
	// /questions/tag
	// /questions/
	// /questions
	path: /^\/questions(?:$|\/(?:tag\/([^\/]+))?)/,

	method: 'GET',
	action: function (req, res) {
		var tag = req.params['0'];

		if (tag) {
			res.redirect(301, 'https://stackoverflow.com/questions/tagged/' + utils.encodeForURI('appcelerator ' + tag));
		} else {
			res.redirect(301, 'https://developer.appcelerator.com');
		}
	}
});
