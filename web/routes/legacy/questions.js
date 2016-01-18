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
		var opts = {};

		if (tag) {
			opts.url = 'https://stackoverflow.com/questions/tagged/' + utils.encodeForURI('appcelerator ' + tag);
			opts.action = 'Browse the <a href="' + opts.url + '">' + tag + '</a> tag on Stack Overflow.';

		} else {
			opts.url = '/';
		}

		utils.redirect(req, res, opts);
	}
});
