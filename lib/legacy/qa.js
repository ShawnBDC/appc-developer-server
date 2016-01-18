var hljs = require('highlight.js'),
	LRU = require("lru-cache"),
	marked = require('marked');

var $ = module.exports = {
	getQuestionById: getQuestionById,
	markup: markup
};

var server = {
	config: {
		s3: {
			key: 'AKIAIUZHSDCXV4BNXO4A',
			secret: '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',
			bucket: 'developer.appcelerator.com'
		}
	},
	logger: console
};

var mode = process.env.mode || 'remote',
	cache = LRU({
		max: 100
	}),
	jsonRegExp = /\.json$/;

function onFetch(file, callback, err, data) {
	if (err) return callback(err);
	if (!jsonRegExp.test(file)) {
		return callback(null, data);
	}

	try {
		var v = JSON.parse(data.toString());
		cache.set(file, v);
		callback(null, v);
	} catch (e) {
		server.logger.error('Failed to parse ' + file);
		server.logger.error(data.toString());
		callback(e);
	}
}

var s3 = require('knox').createClient(server.config.s3);
global.fetch = function fetch(file, callback) {
	var v = cache.get(file);
	if (v) return callback(null, v);

	s3.getFile('/appc-legacy-qa' + file, function (err, res) {
		if (err) {
			return callback(err);
		}

		var cls = Math.floor(res.statusCode / 100) * 100;
		if (cls === 500) {
			return callback(new Error('S3 getFile ' + res.statusCode));
		} else if (cls === 400) {
			return callback('route');
		}

		var data = '';
		res.on('data', function (chunk) {
			data += chunk;
		});
		res.on('end', function () {
			onFetch(file, callback, err, data);
		});
	});
};

function highlight(code, lang) {
	code = code.replace(/&#39;/g, '\'').replace(/&#x2F;/g, '/').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"');
	if (lang === 'no-highlight' || lang === 'nohl') {
		return code;
	}
	if (lang) {
		return hljs.highlight(lang, code).value;
	}
	return hljs.highlightAuto(code).value;
}

function getQuestionById(id, callback) {
	fetch('/questions/' + String(Math.floor(id / 1000)) + '/' + id + '.json', callback);
}

function markup(s) {
	// since marked's options are global and Arrow's admin uses arrow-util which in
	// turn uses marked, we need to force the options everytime we call marked()
	marked.setOptions({
		sanitize: true,
		highlight: highlight,
		renderer: new marked.Renderer({
			highlight: highlight
		})
	});

	return marked(s).replace(/<pre><code>/g, '<pre><code class="hljs">');
}
