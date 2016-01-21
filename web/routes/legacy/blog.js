var Arrow = require('arrow');

module.exports = Arrow.Router.extend({
	name: __filename,

	// /blog/2010/07/ios-package-for-distribution-with-1-4.html
	// /blog/2010/07/ios-package-for-distribution-with-1-4
	// /blog/foo
	// /blog
	path: /^\/blog(?:$|\/)/,

	method: 'GET',
	action: function (req, res) {
		res.redirect(301, 'http://www.appcelerator.com' + req.originalUrl.replace(/\.html($|\?|#)/, ''));
	}

});
