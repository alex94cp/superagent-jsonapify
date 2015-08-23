var parse = require('./common');

module.exports = function(request) {
	request.parse['application/vnd.api+json'] = parseJsonApi;
};

function parseJsonApi(res, callback) {
	res.text = '';
	res.setEncoding('utf8');
	res.on('data', function(chunk) {
		res.text += chunk.replace(/^\s*|\s*$/g, '');
	});
	res.on('end', function() {
		try {
			callback(null, parse(res.text));
		} catch (err) {
			callback(err);
		}
	});
}

