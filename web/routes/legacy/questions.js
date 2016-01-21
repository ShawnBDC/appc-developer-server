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

		var path = req.originalUrl.split('/');

		if (path[2] === 'top-200-experts') {
			url += '/hall-of-fame';

		} else if (path[2] === 'tag' && path[3]) {
			url += '/search?q=' + path[3];
		}

		return res.redirect(301, url);
	}
});
