var fs = require('fs');
var path = require('path');
var should = require('should');
var mdwp = require('../lib/mdwp');

var input = fs.readFileSync(path.join(__dirname, 'fixtures', 'mdwp-input.md'), 'utf8');
var output = fs.readFileSync(path.join(__dirname, 'fixtures', 'mdwp-output.html'), 'utf8');

describe('mdwp', function () {

	it('converts', function (done) {

		var wordpress = mdwp.convert({
			url: 'https://github.com/appcelerator-developer-relations/appc-sample-ti520/blob/master/docs/transitions.md',
			markdown: input
		});

		should(wordpress.title).eql('Titanium 5.2.0: Android Activity &amp; Shared Element Transitions');

		if (wordpress.html !== output) {
			// fs.writeFileSync(path.join(__dirname, 'fixtures', 'mdwp-output.html'), wordpress.html, 'utf8
			// ');
			var err = new Error('expected output to match');
			err.expected = output;
			err.actual = wordpress.html;
			throw err;
		}

		done();
	});

});
