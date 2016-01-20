var Arrow = require('arrow');

module.exports = Arrow.Router.extend({
	name: __filename,

	// /question/183184/not-able-to-run-appcelerator/
	// /question/183184/not-able-to-run-appcelerator
	// /question/183184/
	// /question/183184
	// /question/
	// /question
	path: /^\/question(?:$|\/([0-9]+)?)/,

	method: 'GET',
	action: function (req, res, next) {

		if (req.params['0']) {
			url = 'https://archive.appcelerator.com' + req.originalUrl;
		} else {
			url = '/help';
		}

		return res.redirect(301, url);
	}
});
