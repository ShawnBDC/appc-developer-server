var Arrow = require('arrow');
var feed = require('feed-read');

var cache = {};

var TTL = 1000 * 60 * 10;

module.exports = Arrow.API.extend({
	group: 'feeds',
	path: '/api/feeds/rss',
	method: 'GET',
	description: 'Newest Articles from an RSS Feed',
	plural: 'posts',
	singular: 'post',
	parameters: {
		url: {
			type: 'query',
			description: 'Origin'
		}
	},
	action: function (req, res, next) {
    var url = req.params.url;

		// even if it's expired, we won't wait for the new data
		if (cache[url]) {
			res.success(cache[url].data, next);
		}

		// time to request (new) data
		if (!cache[url] || (Date.now() - cache[url].date > TTL)) {

			feed(url, function (error, articles) {

				if (!error && articles && articles.length > 0) {

					// first time, so we still have to respond
					if (!cache[url]) {
						res.success(articles, next);
					}

					cache[url] = {
						date: Date.now(),
						data: articles
					};

				} else {

					// first time, so we still have to respond
					if (!cache[url]) {
						res.error(error || 'Failed to fetch data', next);
					}
				}
			});
		}
	}
});
