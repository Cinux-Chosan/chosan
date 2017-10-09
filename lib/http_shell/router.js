const exchange_server_route = require('./route/exchange_server_route');
const user_route = require('./route/user_route');

module.exports = fromModule => {
  let router = null;
  switch (fromModule) {
    case 'exchange_server':
      router = (name, ...args) => {
        exchange_server_route[name](...args);
      }
      break;
    case 'user':
      router = (name, ...args) => {
        user_route[name](...args);
      }
      break;
    default:
    break;
  }
  return router;
}
