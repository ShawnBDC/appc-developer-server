var _ = require('lodash');
var Arrow = require('arrow');
var request = require('request');

var cache;

module.exports = Arrow.Router.extend({
	name: __filename,
	path: '/',
	method: 'GET',
	action: function (req, resp, next) {

		var supportMode = req.session.user ? (_.contains(['team', 'enterprise'], req.session.user.org.package) ? 'official' : 'community') : 'unknown';

		if (req.session.user && req.query.supportMode) {
			supportMode = req.query.supportMode;
		}

		function render() {
			resp.render('index', {
				recentQuestions: cache && cache.data, // can also be undefined if first request failed
				supportMode: supportMode
			});

			next();
		}

		// time to request (new) data
		if (!cache || (Date.now() - cache.date > (1000 * 60 * 15))) {

			request({
				url: 'https://api.stackexchange.com/2.2/questions/unanswered?order=desc&sort=creation&pagesize=10&tagged=appcelerator&filter=default&site=stackoverflow',
				json: true,
				gzip: true
			}, function (error, response, body) {

				// if this was our first data, then we must still render
				var mustRender = !cache;

				if (!error && _.isObject(body) && body.items && body.items.length > 0) {
					cache = {
						date: Date.now(),
						data: body.items
					};
				}

				if (mustRender) {
					render();
				}

			});
		}

		// even if it is expired and we're requesting new data, we won't wait for that
		if (cache) {
			render();
		}
	}
});
