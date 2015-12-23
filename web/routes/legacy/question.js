var Arrow = require('arrow');

var utils = require('../../../lib/utils');

module.exports = Arrow.Router.extend({
	name: __filename,

  // http://127.0.0.1:8080/question/183184/not-able-to-run-appcelerator/
	// http://127.0.0.1:8080/question/183184/not-able-to-run-appcelerator
	// http://127.0.0.1:8080/question/183184/
	// http://127.0.0.1:8080/question/183184
	// http://127.0.0.1:8080/question/
	// http://127.0.0.1:8080/question
	path: /^\/question(?:$|\/(?:[0-9]+\/([^\/]+))?)/,

	method: 'GET',
	action: function (req, res) {
    var slug = req.params['0'];

    res.redirect(301, 'https://stackoverflow.com/search?q=' + utils.encodeForURI('[appcelerator]' + (slug ? ' ' + slug.replace(/-/g, ' ') : '')));
	}
});
