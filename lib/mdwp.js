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
		return '<div class="embed-responsive embed-responsive-16by9">\n' + url + '\n</div>';
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

	// Tables
	html = html.replace(/<table>/g, '<div class="table-responsive">\n<table class="table">');
	html = html.replace(/<\/table>/g, '</table>\n</div>');

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
	html += '<style> .blog-posts-single table {width: 100%;margin-bottom: 2em;} .blog-posts-single table thead {font-weight: bold;} .blog-posts-single table thead th {text-align: left;} .blog-posts-single table tbody td {padding-top: 1em;} .blog-posts-single table tbody td p {margin: 0;} .blog-posts-single .post-content table tbody td img {margin: 0;vertical-align: middle;} .embed-responsive{position:relative;display:block;height:0;padding:0;overflow:hidden;margin-bottom:2em;}.embed-responsive .embed-responsive-item,.embed-responsive embed,.embed-responsive iframe,.embed-responsive object,.embed-responsive video{position:absolute;top:0;bottom:0;left:0;width:100%;height:100%;border:0}.embed-responsive-16by9{padding-bottom:56.25%}.embed-responsive-4by3{padding-bottom:75%} .table-responsive {min-height: .01%;overflow-x: auto;}</style>';

	return {
		title: title,
		html: html
	};
};
