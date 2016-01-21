var Arrow = require('arrow');

module.exports = Arrow.Router.extend({
	name: __filename,

	// /question/183184/not-able-to-run-appcelerator/
	// /question/183184/not-able-to-run-appcelerator
	// /question/183184/
	// /question/183184
	// /question/
	// /question
	path: /^\/question(?:$|\/)([0-9]+)?/,

	method: 'GET',
	action: function (req, res) {
		var id = req.params['0'];
		var url = 'https://archive.appcelerator.com';

		if (id) {
			url += req.originalUrl;
		}

		return res.redirect(301, url);
	}
});
