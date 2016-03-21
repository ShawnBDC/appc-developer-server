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

		} else {

			if (!url) {
				return respond();
			}

			var match = url.match(/^https:\/\/github\.com\/([^\/]+)\/([^\/]+)\/blob\/([^\/]+)\/(.+)$/);

			if (!match) {
				return respond();
			}

			var apiUrl = 'https://api.github.com/repos/' + match[1] + '/' + match[2] + '/contents/' + match[4] + '?ref=' + match[3];

			request({
				url: apiUrl,
				json: true,
				auth: {
					user: 'fokkezb',
					pass: 'c7ae7f1f32da9d500d8991092de668305fb1e0ed'
				},
				headers: {
					'User-Agent': 'Appcelerator Arrow'
				}
			}, function (error, response, body) {

				if (error) {
					return next(error);
				}

				if (response.statusCode !== 200) {
					return next(new HttpError(response.statusCode, body.message));
				}

				if (!body.content) {
					return next(new HttpError(400, 'File not found on GitHub'));
				}

				markdown = new Buffer(body.content, 'base64').toString('ascii');

				respond();
			});

		}

	}
});
