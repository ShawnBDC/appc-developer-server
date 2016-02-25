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
				}
				/*, {
								username: 'Appcelerator',
								name: 'Appcelerator',
								title: 'Corporate Account'
							}*/
			],
			footerTop: [{
				title: 'Product',
				links: [{
					title: 'Appcelerator Platform',
					href: 'http://www.appcelerator.com/mobile-app-development-products/'
				}, {
					title: 'Plans &amp; Pricing',
					href: 'http://www.appcelerator.com/pricing/'
				}]
			}, {
				title: 'Developers',
				links: [{
					title: 'App U.',
					href: 'http://university.appcelerator.com/'
				}, {
					title: 'Q&amp;A Support',
					href: 'http://community.appcelerator.com/'
				}, {
					title: 'Documentation',
					href: 'http://docs.appcelerator.com/'
				}, {
					title: 'Events',
					href: 'http://www.appcelerator.com/company/events/'
				}]
			}, {
				title: 'Enterprise',
				links: [{
					title: 'Overview',
					href: 'http://www.appcelerator.com/enterprise/'
				}]
			}, {
				title: 'About',
				links: [{
					title: 'Company',
					href: 'http://www.appcelerator.com/company/'
				}, {
					title: 'Jobs',
					href: 'http://www.appcelerator.com/company/jobs/'
				}, {
					title: 'Leadership',
					href: 'http://www.appcelerator.com/company/#leadership-team'
				}, {
					title: 'Contact Us',
					href: 'http://www.appcelerator.com/contact-us/'
				}, {
					title: 'Partners',
					href: 'http://www.appcelerator.com/partners/'
				}]
			}],
			footerBottom: [{
				title: 'Customers',
				links: [{
					title: 'Case Studies',
					href: 'http://www.appcelerator.com/resource-center/case-studies/'
				}, {
					title: 'App Showcase',
					href: 'http://www.appcelerator.com/company/app-showcase/'
				}]
			}, {
				title: 'Media',
				links: [{
					title: 'Press',
					href: 'http://www.appcelerator.com/company/news/'
				}, {
					title: 'Whitepapers',
					href: 'http://www.appcelerator.com/resource-center/white-papers/'
				}, {
					title: 'Webinars',
					href: 'http://www.appcelerator.com/resource-center/webinars/'
				}, {
					title: 'Research',
					href: 'http://www.appcelerator.com/resource-center/research/'
				}, {
					title: 'Videos',
					href: 'http://www.appcelerator.com/resource-center/videos/'
				}]
			}, {
				title: 'Blog',
				links: [{
					title: 'Developer',
					href: 'http://www.appcelerator.com/cat/developer/'
				}, {
					title: 'Enterprise',
					href: 'http://www.appcelerator.com/cat/enterprise/'
				}, {
					title: 'Product Updates',
					href: 'http://www.appcelerator.com/cat/product-updates/'
				}]
			}, {
				title: 'Open Source',
				links: [{
					title: 'Titanium',
					href: 'http://www.appcelerator.org/'
				}]
			}]
		});
	}
});
