# 简单快捷的命令

## 命令

### server

用于在当前目录下面新建网络服务器，在需要内网传输文件的时候非常方便。

格式：

`server [port] [-i]`

- `port`:服务端口号，默认 8888
- `-i`:忽略文件权限导致的错误

使用示例：

`server`  

`server 9000`

`server -i`

---

### w2u

---

### http_shell

服务端：

node  http_shell.js 8888 -e

执行客户端：

node http_shell.js 8888 name=zhangjianjun

输入客户端：

node http_shell.js 8888 name=zhangjianjun11111 to=zhangjianjun
