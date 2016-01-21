var Arrow = require('arrow');

module.exports = Arrow.Router.extend({
	name: __filename,

	// /user/1517865/fokke-zandbergen/
	// /user/1517865/fokke-zandbergen
	// /user/1517865/
	// /user/1517865
	// /user/
	// /user
	path: /^\/user(?:$|\/)/,

	method: 'GET',
	action: function (req, res) {
		return res.redirect(301, 'https://archive.appcelerator.com');
	}

});
