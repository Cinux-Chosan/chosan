const net = require('net');
const { jp } = require('../common');
const router = require('./router')('exchange_server');

module.exports = function(args) {
  let port = args.p || args.originArgs[0];
  let server = net.createServer();

  server.on('connection', socket => {
    console.log(`connect from ${socket.remoteAddress}\t port: ${socket.remotePort}`);
    socket.on('data', data => {
      oData = jp(data);
      router(oData.type, oData, socket);
    });
    socket.on('close', () => {
      router('close', socket);
    });
    socket.on('error', err => {
      console.log(err);
      router('close', socket);
    });
  });

  server.listen(port, () => {
    console.log(`server listen on port:\t ${port}`);
  });
}
