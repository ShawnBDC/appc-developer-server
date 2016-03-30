var Arrow = require('arrow');
var HttpError = require('lib/HttpError');
var utils = require('lib/utils');
var moment = require('moment');

var URL = 'http://www.appcelerator.com/social-rss-feed/?numposts=30&cat=9%2C12';

module.exports = Arrow.Router.extend({
	name: __filename,
	path: '/scripts/mbip',
	method: 'GET',
	action: function (req, res, next) {

		if (!req.session.user || req.session.user.email.indexOf('@appcelerator.com') === -1) {
			return next(new HttpError(401, 'Unauthorized'));
		}

		if (req.query.from) {

			var from = moment(req.query.from);

			if (!from.isValid()) {
				return next('Not a valid date.');
			}

			utils.readFeed(URL, function (err, items) {

				if (!items) {
					return next(err || 'Failed to fetch posts');
				}

				var posts = items.filter(function (post) {
					return moment(post.date).isSameOrAfter(from);
				});

				res.render('scripts/mbip', {
					title: 'Mobile Impact',
					posts: posts,
					from: req.query.from
				});

				next();
			});

		} else {

			res.render('scripts/mbip', {
				title: 'Mobile Impact',
				from: moment().subtract(1, 'months').format('YYYY-MM-DD')
			});

			next();
		}

	}
});
