var Arrow = require('arrow');

module.exports = Arrow.Router.extend({
	name: __filename,

	// /devlink/profile/1517865/fokke-zandbergen/
	// /devlink/profile/1517865/fokke-zandbergen
	// /devlink/profile/1517865/
	// /devlink/profile/1517865
	// /devlink/profile/
	// /devlink/profile
	// /devlink/
	// /devlink
	path: /^\/devlink(?:$|\/)(?:profile\/([0-9]+))?/,

	method: 'GET',
	action: function (req, res) {
		var id = req.params['0'];
		var url = 'https://devlink.appcelerator.com';

		if (id) {
			url += '/dev/' + id;
		}

		return res.redirect(301, url);
	}
});
