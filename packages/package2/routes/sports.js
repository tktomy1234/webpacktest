const path = require('path');
const fs = require('fs');
const {ensureExists} = require('package1/utils');
const config = require('../config');

module.exports.post = (req, res) => {
	res.json({config.paths})
}
