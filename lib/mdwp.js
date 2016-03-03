var helpers = require('./helpers');
var MarkdownIt = require('markdown-it');
var path = require('path');

exports.convert = function (opts) {
	var url = opts.url;
	var markdown = opts.markdown;

	var urlMatch = url.match(/^(https:\/\/github\.com\/[^\/]+\/[^\/]+\/)blob\/([^\/]+)(.+)$/);

	if (!urlMatch) {
		throw new Error('Unsupported URL');
	}

	var urlBase = urlMatch[1];
	var urlBranch = urlMatch[2];
	var urlDir = path.dirname(urlMatch[3]);

	var md = new MarkdownIt();

	var title;
	var html = md.render(markdown);

	// extract title, bump headings and add anchor
	html = html.replace(/<h([0-9]+)>([^<]+)<\/h[0-9]+>/g, function (match, level, text) {
		level = parseInt(level, 10);

		if (level === 1) {
			title = text;
			return '';

		} else {
			level = level + 2;
			var id = helpers.slug(text);

			return '<h' + level + ' id="' + id + '">' + text + '</h' + level + '>';
		}
	});

	// YouTube
	html = html.replace(/<p><a href="(https:\/\/www\.youtube\.com\/watch\?v=[^"]+)"><img[^>]+><\/a><\/p>/g, function (match, url) {
		return url;
	});

	// Images
	html = html.replace(/<img src="([^"]+)"/g, function (match, src) {

		// Relative src
		if (src.indexOf('://') === -1) {

			// Resolve relative to dir where MD is in
			src = urlBase + 'raw/' + urlBranch + path.resolve(urlDir, src);
		}

		return '<img src="' + src + '"';
	});

	// Links
	html = html.replace(/<a href="([^"]+)"/g, function (match, href) {
		var target = '_blank';

		// Relative href
		if (href.indexOf('://') === -1) {
			var view = href.match(/(^|\/)[^\/]*\.[^\/\.]+$/) ? 'blob' : 'tree';
			href = urlBase + view + '/' + urlBranch + path.resolve(urlDir, href);

		} else {
			var hrefMatch = href.match(/^http(?:s)?:\/\/(?:www\.)?appcelerator\.com(.+)$/);

			// Absolute URL to local page on appcelerator.com
			if (hrefMatch) {
				href = hrefMatch[1];
				target = null;
			}
		}

		var a = '<a href="' + href + '"';

		if (target) {
			a += ' target="' + target + '"';
		}

		return a;
	});

	// Code
	html = html.replace(/<pre><code>(&lt;)?/g, function (match, xml) {
		return '<pre><code class="' + (xml ? 'xml' : 'js') + '">' + (xml || '');
	});

	// trim but end with newline
	html = html.replace(/^[\s\t\v\n\r\f]+|[\s\t\v\n\r\f]+$/g, '') + '\n';

	return {
		title: title,
		html: html
	};
};
