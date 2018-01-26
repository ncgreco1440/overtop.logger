var Handler = function(details, cb) {
	for(prop in details) {
		if(typeof prop === typeof Error) {
			cb({error: true});
			return;
		}
	}
	cb({error: false});
	return;
};

module.exports = Handler;