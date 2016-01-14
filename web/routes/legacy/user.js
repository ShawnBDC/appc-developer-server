var Arrow = require('arrow');

var utils = require('../../../lib/utils');

module.exports = Arrow.Router.extend({
	name: __filename,

	// /user/1517865/fokke-zandbergen/
	// /user/1517865/fokke-zandbergen
	// /user/1517865/
	// /user/1517865
	// /user/
	// /user
	path: /^\/user(?:$|\/(?:([0-9]+))?)(?:$|\/(?:([^\/]+))?)/,

	method: 'GET',
	action: function (req, res) {
		var id = req.params['0'];
		var slug = req.params['1'];

		var opts = {};

		opts.template = 'redirect_dl';
		opts.url = 'https://devlink.appcelerator.com';

		if (slug) {
			slug = slug.replace(/-/g, ' ');

			opts.url += '/search?term=' + utils.encodeForURI(slug);
			opts.action = 'Search for <em>"' + slug + '"</em> on DevLink 2.0';

		} else if (id) {
			opts.url += '/dev/' + id;
			opts.action = 'Go to the profile you were looking for on DevLink 2.0';

		} else {
			opts.action = 'Continue to DevLink 2.0';
		}

		utils.redirect(req, res, opts);
	}

});
