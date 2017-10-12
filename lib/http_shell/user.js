const net = require('net');
const readline = require('readline');
const {json, jp} = require('../common');
const router = require('./router')('user');

module.exports = function(args = {}) {
  let client = connect(args);

  let rl = readline.createInterface({input: process.stdin, output: process.stdout});

  rl.setPrompt('> ');

  rl.on('line', line => {
    client.write(json({type: 'cmd', cmd: line}));
  });

  client.on('error', err => {
    client = connect(args);
  });

  client.on('close', () => {
    client = connect(args);
  });

  client.on('data', data => {
    let oData = jp(data);
    router(oData.type, oData, client, rl);
  });
}

function connect (args) {
  let client = net.connect({
    port: args.p || args.originArgs[0] || 8888,
    host: args.h || '127.0.0.1'
  }, () => {
    console.log('连接服务器成功！');
    client.write(json({type: 'auth', name: args.name, pwd: args.pwd, to: args.to}));
    rl.prompt();
  });
  return client;
}
