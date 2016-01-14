var Arrow = require('arrow');

var utils = require('../../../lib/utils');

module.exports = Arrow.Router.extend({
	name: __filename,

	// /question/183184/not-able-to-run-appcelerator/
	// /question/183184/not-able-to-run-appcelerator
	// /question/183184/
	// /question/183184
	// /question/
	// /question
	path: /^\/question(?:$|\/(?:[0-9]+\/([^\/]+))?)/,

	method: 'GET',
	action: function (req, res) {
		var slug = req.params['0'];
		var opts = {};

		if (slug) {
			slug = slug.replace(/-/g, ' ');

			opts.url = 'https://www.google.com/search?q=' + utils.encodeForURI('site:stackoverflow.com +appcelerator ' + slug);
			opts.action = 'Search for <em>"' + slug + '"</em> on Stack Overflow';

		} else {
			opts.url = 'https://developer.appcelerator.com';
			opts.action = 'Continue to our new <em>Get Help</em> portal';
		}

		utils.redirect(req, res, opts);
	}
});
