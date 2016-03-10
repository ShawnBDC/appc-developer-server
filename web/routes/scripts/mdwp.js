var Arrow = require('arrow');
var HttpError = require('lib/HttpError');
var mdwp = require('lib/mdwp');
var request = require('request');

module.exports = Arrow.Router.extend({
	name: __filename,
	path: '/scripts/mdwp',
	method: 'GET',
	action: function (req, res, next) {

		if (!req.session.user || req.session.user.email.indexOf('@appcelerator.com') === -1) {
			return next(new HttpError(401, 'Unauthorized'));
		}

		var url, markdown, title, html;

		function respond() {

			if (url && markdown) {

				try {

					var converted = mdwp.convert({
						url: url,
						markdown: markdown
					});

					title = converted.title;
					html = converted.html;

				} catch (e) {
					return next(e);
				}
			}

			res.render('scripts/mdwp', {
				title: "Convert MarkDown READMEs to Wordpress Posts",
				url: url,
				markdown: markdown,
				wpTitle: title,
				html: html
			});

			next();
		}

		if (req.query.url) {
			url = req.query.url;
		}

		if (req.query.markdown) {
			markdown = req.query.markdown;

			respond();

		} else if (url && url.indexOf('/blob/') !== -1) {
			request(url.replace('/blob/', '/raw/'), function (error, response, body) {

				if (error) {
					return next(error);
				}

				markdown = body;

				respond();
			});

		} else {
			respond();
		}

	}
});
