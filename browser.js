var common = require('./common');

var parse = common.parse;
var serialize = common.serialize;

module.exports = function(request) {
	request.parse['application/vnd.api+json'] = parse;
	request.serialize['application/vnd.api+json'] = serialize;
};
