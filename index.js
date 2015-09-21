var common = require('./common');

var parse = common.parse;
var serialize = common.serialize;

module.exports = function(request) {
	request.parse['application/vnd.api+json'] = parseJsonApi;
	request.serialize['application/vnd.api+json'] = serialize;
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
