const { json, jp } = require('../../common');

let connections = {
  count() {
    return Object.keys(this).forEach(el => this[es] instanceof net.Socket).length;
  }
};

exports.auth = (args, socket) => {
  // 登陆认证，保存socket
  socket.auth = args;
  connections[`${args.name}`] = socket;
  // 通过 to 属性将socket关联
  if (args.to) {
    let to = connections[args.to];
    socket.to = to;
    to[`${socket.remoteAddress}:${socket.remotePort}`] = socket;
  }
}

exports.close = socket => {
  socket.write(json({type: 'close', msg: '关闭连接！' }), 'utf8', () => connections[`${args.name}`] = null);
}

exports.cmd = (cmd, socket) => {
  cmd.from = `${socket.remoteAddress}:${socket.remotePort}`;
  socket.to.write(json(cmd));
}

exports.cmdAck = (data, socket) => {
  console.log(oData);
  socket[oData.to].write(json(data));
}
