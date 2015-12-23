var Arrow = require('arrow');

var utils = require('../../../lib/utils');

module.exports = Arrow.Router.extend({
	name: __filename,

  // http://127.0.0.1:8080/questions/tag/iphone/
	// http://127.0.0.1:8080/questions/tag/iphone
	// http://127.0.0.1:8080/questions/tag/
	// http://127.0.0.1:8080/questions/tag
	// http://127.0.0.1:8080/questions/
	// http://127.0.0.1:8080/questions
	path: /^\/questions(?:$|\/(?:tag\/([^\/]+))?)/,

	method: 'GET',
	action: function (req, res) {
    var tag = req.params['0'];

    res.redirect(301, 'https://stackoverflow.com/questions/tagged/' + utils.encodeForURI('appcelerator' + (tag ? ' ' + tag : '')));
	}
});
