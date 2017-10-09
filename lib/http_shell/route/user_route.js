const {exec} = require('child_process');
const {json, jp} = require('../../common');
exports.cmd = (cmd, socket) => {
  // 执行相应的 cmd，结果以 cmdAck 事件返回服务端，返回给 cmd.from
  let sCmd = cmdProcessor(cmd.cmd);
  if (!sCmd) return;
  exec(sCmd, { cwd: socket.cwd }, (err, stdout, stderr) => {
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
    socket.cwd = process.cwd();
  })
}

exports.cmdAck = (cmdAck, socket, rl) => {
  console.log(cmdAck.cmdAck);
  rl.prompt();
}



function cmdProcessor(cmd) {
  if (cmd.match(/cd\s*/)) {
    let dir = cmd.replace(/cd\s*/, '');
    process.chdir(dir);
  }
  return cmd;
}
