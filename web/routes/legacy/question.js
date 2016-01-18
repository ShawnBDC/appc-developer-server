var _ = require('lodash');

var Arrow = require('arrow');

var utils = require('../../../lib/utils');
var qa = require('../../../lib/legacy/qa');

module.exports = Arrow.Router.extend({
	name: __filename,

	// /question/183184/not-able-to-run-appcelerator/
	// /question/183184/not-able-to-run-appcelerator
	// /question/183184/
	// /question/183184
	// /question/
	// /question
	path: /^\/question(?:$|\/([0-9]+)?(?:$|\/([^\/]+)?))/,

	method: 'GET',
	action: function (req, res, next) {
		var id = parseInt(req.params['0']);
		var slug = req.params['1'];

		var opts = {};

		if (id) {

			qa.getQuestionById(id, function (err, question) {

				if (err) {

					if (slug) {
						opts.title = slug.replace(/-/g, ' ');
					}

				} else {
					opts.title = question.title;
					// opts.question = qa.markup(question.question);
					//
					// if (question.accepted_answer_id) {
					// 	opts.answer = _.find(question.answers, {
					// 		id: question.accepted_answer_id
					// 	});
					// }
				}

				opts.url = 'https://www.google.com/search?q=' + utils.encodeForURI('site:stackoverflow.com +appcelerator ' + opts.title);
				opts.action = '<a href="' + opts.url + '">Search Stack Overflow</a> for <em>"' + opts.title + '"</em> or try <a href="http://webcache.googleusercontent.com/search?q=cache:https://developer.appcelerator.com' + req.originalUrl + '&num=1&strip=1&vwsrc=0">Google\'s cache</a>.';

				utils.redirect(req, res, opts);

				return next();

			});

		} else {
			opts.url = '/';

			utils.redirect(req, res, opts);

			return next();
		}
	}
});
