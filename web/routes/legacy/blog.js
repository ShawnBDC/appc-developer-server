var Arrow = require('arrow');

module.exports = Arrow.Router.extend({
	name: __filename,

	// /blog/foo
	// /blog/
	// /blog
	path: /^\/blog(?:$|\/)/,

	method: 'GET',
	action: function (req, res) {
		res.redirect(301, 'http://www.appcelerator.com/blog');
	}

});
