var Arrow = require('arrow');

module.exports = Arrow.Router.extend({
	name: __filename,

	// /questions/tag/iphone/
	// /questions/tag/iphone
	// /questions/tag/
	// /questions/tag
	// /questions/
	// /questions
	// /questions/top-200-experts
	path: /^\/questions(?:$|\/)/,

	method: 'GET',
	action: function (req, res) {
		var url = 'https://archive.appcelerator.com';

		if (req.originalUrl.indexOf('/questions/top-200-experts') === 0) {
			url += '/hall-of-fame';
		}

		return res.redirect(301, url);
	}
});
