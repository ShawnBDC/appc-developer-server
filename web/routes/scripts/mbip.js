var Arrow = require('arrow');
var HttpError = require('lib/HttpError');
var mdwp = require('lib/mdwp');
var request = require('request');

// FIXME: https://github.com/appcelerator/appc_web_com/pull/368
var URL = 'https://www.appcelerator.com/feed/?cat=9%2C12';

module.exports = Arrow.Router.extend({
	name: __filename,
	path: '/scripts/mbip',
	method: 'GET',
	action: function (req, res, next) {

		if (!req.session.user || req.session.user.email.indexOf('@appcelerator.com') === -1) {
			return next(new HttpError(401, 'Unauthorized'));
		}

		req.server.getAPI('/api/feeds/rss').execute({
			url: URL
		}, function (err, results) {

			if (!results) {
				return next(err || 'Failed to fetch posts');
			}

			var posts = results[results.key];

			res.render('scripts/mbip', {
				title: 'Mobile Impact',
				posts: posts
			});

			next();
		});

	}
});
