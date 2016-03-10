var _ = require('lodash');
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

	// Fix that MarkDown-It doesn't handle links with spaces
	markdown = markdown.replace(/\[([^\]]+)\]\(([^\)]+)\)/g, function (match, text, link) {
		return '[' + text + '](' + link.replace(/ /g, '%20') + ')';
	});

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
			var id = helpers.slug(_.unescape(text));

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

		// Anchors
		if (href[0] === '#') {
			target = null;

			// Relative href
		} else if (href.indexOf('://') === -1) {
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

	// some additional styling
	html += '<style> .blog-posts-single iframe {margin-bottom:2em;} .blog-posts-single table {width: 100%;margin-bottom: 2em;} .blog-posts-single table thead {border-bottom: 1px solid #999;font-weight: bold;} .blog-posts-single table thead th {padding-bottom: 1em;text-align: left;} .blog-posts-single table tbody td {padding-top: 1em;} .blog-posts-single table tbody td p {margin: 0;} .blog-posts-single .post-content table tbody td img {margin: 0;vertical-align: middle;} </style>';

	return {
		title: title,
		html: html
	};
};
