var parse = require('./common');

module.exports = function(request) {
	request.parse['application/vnd.api+json'] = parseJsonApi;
};

function parseJsonApi(text) {
	return parse(text);
}
