var FeedParser = require('feedparser');
var request = require('request');

var $ = module.exports = {
	getRandom: getRandom,
	extractImageSrc: extractImageSrc,
	readFeed: readFeed
};

function getRandom(min, max) {
	return Math.random() * (max - min) + min;
}

function extractImageSrc(html) {
	var match = html.match(/<img[^>]+src="([^"]+)"[^>]+>/);

	if (match) {
		return match[1];
	}
}

function readFeed(url, callback) {
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
