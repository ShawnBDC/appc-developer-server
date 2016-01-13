var Arrow = require('arrow');

module.exports = Arrow.Router.extend({
	name: __filename,

	// /user/1517865/fokke-zandbergen/
	// /user/1517865/fokke-zandbergen
	// /user/1517865/
	// /user/1517865
	// /user/
	// /user
	path: /^\/user(?:$|\/(?:([0-9]+))?)/,

	method: 'GET',
	action: function (req, res) {
		var id = req.params['0'];
		var url = 'https://devlink.appcelerator.com';

		if (id) {
			url += '/dev/' + id;
		}

		res.redirect(301, url);
	}
});
