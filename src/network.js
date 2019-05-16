const request = require('superagent-use')(require('superagent'));
const prefix = require('superagent-prefix');

request.use(prefix('http://localhost:8080'));

module.exports = request;
