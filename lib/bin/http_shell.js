const extServer = require('../http_shell/exchange_server');
const userConnect = require('../http_shell/user');
const { parseArgv } = require('../common');

let args = process.argv.slice(2);

let oArgs = parseArgv(args);

let isExtServer = oArgs.has('-e');

if (isExtServer) {
  // exchange server
  return new extServer(oArgs);
} else {
  // user
  return new userConnect(oArgs);
}
