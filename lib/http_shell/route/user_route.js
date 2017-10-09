const {exec} = require('child_process');
const {json, jp} = require('../../common');
exports.cmd = (cmd, socket) => {
  // 执行相应的 cmd，结果以 cmdAck 事件返回服务端，返回给 cmd.from
  exec(cmd.cmd, (err, stdout, stderr) => {
    if (err) {
      console.error(`exec error: ${err}`);
      return;
    };
    let cmdAck = {
      type: 'cmdAck',
      cmdAck: stdout || stderr,
      to: cmd.from
    }
    socket.write(json(cmdAck));
  })
}

exports.cmdAck = (cmdAck, socket, rl) => {
  console.log(cmdAck.cmdAck);
  rl.prompt();
}
