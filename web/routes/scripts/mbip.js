var Arrow = require('arrow');
var HttpError = require('lib/HttpError');
var utils = require('lib/utils');

var URL = 'http://www.appcelerator.com/social-rss-feed/?numposts=30&cat=9%2C12';

module.exports = Arrow.Router.extend({
	name: __filename,
	path: '/scripts/mbip',
	method: 'GET',
	action: function (req, res, next) {

		if (!req.session.user || req.session.user.email.indexOf('@appcelerator.com') === -1) {
			return next(new HttpError(401, 'Unauthorized'));
		}

		utils.readFeed(URL, function (err, items) {

			if (!items) {
				return next(err || 'Failed to fetch posts');
			}

			res.render('scripts/mbip', {
				title: 'Mobile Impact',
				posts: items
			});

			next();
		});

	}
});
