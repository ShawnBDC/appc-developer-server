var Arrow = require('arrow');

module.exports = Arrow.Router.extend({
	name: __filename,
	path: '/',
	method: 'GET',
	action: function (req, res) {
		res.render('index', {
			scripts: ['/js/crazyColors.js'],
			developers: [{
				username: 'RicardoAlcocer',
				name: 'Ricardo Alcocer',
				title: 'Director DevRel & Training'
			}, {
				username: 'FokkeZB',
				name: 'Fokke Zandbergen',
				title: 'Developer Evangelist'
			}, {
				username: 'JHaynie',
				name: 'Jeff Haynie',
				title: 'Co-Founder & CEO'
			}, {
				username: 'Hansemannnn',
				name: 'Hans Knoechel',
				title: 'iOS Engineer'
			}, {
				username: 'RBlalock',
				name: 'Rick Blalock',
				title: 'Mobile Architect'
			}, {
				username: 'AppcDev',
				name: 'Appcelerator Dev',
				title: 'Developer Relations'
			}/*, {
				username: 'Appcelerator',
				name: 'Appcelerator',
				title: 'Corporate Account'
			}*/]
		});
	}
});
