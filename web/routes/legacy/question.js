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

		if (slug) {
			slug = slug.replace(/-/g, ' ');
			res.redirect(301, 'https://www.google.com/search?q=' + utils.encodeForURI('site:stackoverflow.com +appcelerator ' + slug));
		} else {
    	res.redirect(301, 'https://developer.appcelerator.com');
		}
	}
});
