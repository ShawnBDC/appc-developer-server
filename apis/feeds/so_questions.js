var _ = require('lodash');
var Arrow = require('arrow');
var request = require('request');

var utils = require('../../lib/utils');

var cache;
var cachedAt;

module.exports = Arrow.API.extend({
	group: 'feeds',
	path: '/api/feeds/so_questions',
	method: 'GET',
	description: 'Newest Appcelerator Stack Overflow Questions',
	plural: 'questions',
	singular: 'question',
	action: function (req, res, next) {

		// even if it's expired, we won't wait for the new data
		if (cache) {
			res.success(cache, next);
		}

		// time to request (new) data (random to not do all together)
		if (!cache || (Date.now() - cachedAt > (1000 * 60 * utils.getRandom(10, 15)))) {

			request({
				url: 'https://api.stackexchange.com/2.2/questions/unanswered?order=desc&sort=creation&pagesize=10&tagged=appcelerator&filter=default&site=stackoverflow',
				json: true,
				gzip: true
			}, function (error, response, body) {

				if (!error && _.isObject(body) && body.items && body.items.length > 0) {

					var questions = _.map(body.items.slice(0, 10), function(question) {
						question.creation_date = question.creation_date * 1000;
						return question;
					});

					// first time, so we still have to respond
					if (!cache) {
						res.success(questions, next);
					}

					cachedAt = Date.now();
					cache = questions;

				} else {

					// first time, so we still have to respond
					if (!cache) {
						res.error(error || 'Failed to fetch data', next);
					}
				}
			});
		}
	}
});
