var Arrow = require('arrow');

module.exports = Arrow.Router.extend({
	name: __filename,

	// http://127.0.0.1:8080/devlink/profile/1517865/fokke-zandbergen/
	// http://127.0.0.1:8080/devlink/profile/1517865/fokke-zandbergen
	// http://127.0.0.1:8080/devlink/profile/1517865/
	// http://127.0.0.1:8080/devlink/profile/1517865
	// http://127.0.0.1:8080/devlink/profile/
	// http://127.0.0.1:8080/devlink/profile
	// http://127.0.0.1:8080/devlink/
	// http://127.0.0.1:8080/devlink
	path: /^\/devlink(?:$|\/(?:profile\/([0-9]+))?)/,

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
