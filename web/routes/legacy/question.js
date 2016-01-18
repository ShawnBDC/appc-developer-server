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
			opts.action = 'Try <a href="http://webcache.googleusercontent.com/search?q=cache:https://developer.appcelerator.com' + req.originalUrl + '&num=1&strip=1&vwsrc=0">Google\'s cache</a> or <a href="' + opts.url + '">Search Stack Overflow</a> for <em>' + slug + '</em>.';

		} else {
			opts.url = '/';
		}

		utils.redirect(req, res, opts);
	}
});
