let http = require('http');
let url = require('url');
let path = require('path');
let mime = require("mime");
let fs = require('fs');
let os = require('os');

let port = process.argv[2];
let handlers = {};

if (!port) {
  port = 8888;
}

http.createServer((req, res) => {
  route(req, res);
}).listen(port, () => {
  console.log(`server listen on port ${port}`);
  let netWorkInterfaces = os.networkInterfaces();
  for (let networkInterface in netWorkInterfaces) {
    for (let el of netWorkInterfaces[networkInterface]) {
      if (el.family == "IPv4" && !el.address.match(/^127./)) {
        console.log(`IP: ${el.address}`);
      }
    }
  }
});

function route(req, res) {
  let pathname = decodeURIComponent(url.parse((req.url)).pathname);
  console.log(pathname);
  let absPath = path.join(`${process.cwd()}`, pathname);
  if (fs.lstat(absPath, (err, stat) => {
    if (!err) {
      if (stat.isDirectory()) {
        res.writeHead(200, {"Content-Type": "text/html"});
        fs.readdir(absPath, (err, files) => {
          let fileList = [];
          let dirList = [];
          files.forEach(file => fs.lstat(`${path.join(absPath, file)}`, (err, stat) => {
            let href = `${req.url.endsWith('/')
              ? req.url
              : (req.url + '/')}${encodeURIComponent(file)}`;
            let item = `
              <li>
                <a href="${href}">${file}</a>
              </li>
            `;
            if (stat.isDirectory()) {
              dirList.push(item);
            } else {
              fileList.push(item);
            }
            if (fileList.concat(dirList).length == files.length) {
              let html = `
              <!DOCTYPE html>
              <html>
                <head>
                  <meta charset="utf-8">
                  <title>${req.url}</title>
                </head>
                <body>
                  ${fileList.length
                ? '<h2>文件</h2>'
                : ''}
                  <ul>
                    ${fileList.join('')}
                  </ul>
                  ${dirList.length
                  ? '<h2>目录</h2>'
                  : ''}
                  <ul>
                    ${dirList.join('')}
                  </ul>
                </body>
              </html>
              `;
              res.end(html);
            }
          }));
        });
      } else { // 是一个文件
        absPath = absPath.replace(/[\\\/]*$/, '');
        let rStream = fs.createReadStream(absPath);
        res.writeHead(200, {"Content-Type": `${mime.lookup(absPath)}; charset=utf-8`});
        rStream.on('error', e => console.log(e));
        rStream.on('close', () => res.end());
        rStream.pipe(res);
      }
    } else {
      res.end(JSON.stringify(err));
    }
  })) ;
  }
