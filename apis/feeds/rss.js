var Arrow = require('arrow');
var FeedParser = require('feedparser');
var request = require('request');

var utils = require('../../lib/utils');

var cache = {};

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

		// time to request (new) data (random to not do all together)
		if (!cache[url] || (Date.now() - cache[url].date > (1000 * 60 * utils.getRandom(10, 15)))) {

			feed(url, function (error, articles) {

				if (!error && articles && articles.length > 0) {
					articles = articles.slice(0, 10);

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

function feed(url, callback) {
	var req = request(url);
	var feedparser = new FeedParser();

	var items = [];

	req.on('error', callback);
	req.on('response', function (res) {

		if (res.statusCode !== 200) {
			return this.emit('error', new Error('Bad status code'));
		}

		res.pipe(feedparser);
	});

	feedparser.on('error', callback);
	feedparser.on('end', function (err) {
		callback(err, items);
	});
	feedparser.on('readable', function () {
		var item;

		while ((item = this.read())) {
			items.push(item);
		}
	});
}
