const request = require('superagent-use')(require('superagent'));
const prefix = require('superagent-prefix');

request.use(prefix('https://voteapi.ieeeuottawa.ca'));

module.exports = request;
