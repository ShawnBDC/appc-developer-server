Arrow = require('arrow');

module.exports = Arrow.createModel('user', {
	fields: {
		guid: {
			type: 'String'
		},
		lastViewedHome: {
			type: 'Date'
		}
	},
	connector: 'appc.arrowdb',
	singular: 'user',
	plural: 'users',
	metadata: {
		cms: {
			readableName: 'Users',
			fields: {
				guid: {
					readableName: 'Appcelerator User GUID'
				},
				lastViewedHome: {
					readableName: 'Last time user viewed home',
					type: 'date'
				}
			}
		}
	}
});
