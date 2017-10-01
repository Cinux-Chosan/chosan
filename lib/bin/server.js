const http = require('http');
const url = require('url');
const path = require('path');
const mime = require("mime");
const fs = require('fs');
const os = require('os');
const zlib = require('zlib');
const stream = require('stream');

let args = process.argv.slice(2);
let port = args[0];

if (!port || !parseInt(port)) {
  port = 8888;
}

let ignoreErr = args.includes('-i');

http.createServer((req, res) => {
  route(req, res);
}).listen(port, () => {
  console.log(`\nserver listen on port: \t${port}\n`);
  let netWorkInterfaces = os.networkInterfaces();
  for (let nf in netWorkInterfaces) {
    for (let el of netWorkInterfaces[nf]) {
      if (el.family == "IPv4" && !el.address.match(/^127./)) {
        console.log(`${nf}\tIP\t ${el.address}`);
      }
    }
  }
});

function route(req, res) {
  let reqUrl = decodeURIComponent(req.url);
  let urlObj = url.parse(reqUrl);
  let pathname = urlObj.pathname;
  console.log(pathname);
  let absPath = path.join(`${process.cwd()}`, pathname);
  if (fs.lstat(absPath, (err, stat) => {
      if (!err) {
        if (stat.isDirectory()) {
          fs.readdir(absPath, (err, files) => {
            let fileList = [];
            let dirList = [];
            let errList = [];
            files.forEach((file, index) => fs.lstat(`${path.join(absPath, file)}`, (err, stat) => {
              if (err) {
                if (ignoreErr) {
                  errList.push(`<li><pre>${JSON.stringify(err, null, 4)}</pre></li>`);
                } else {
                 return res.end(JSON.stringify(err))
                }
              } else {
                let item = `
                <li>
                  <a href="${encodeURIComponent(file) + (stat.isDirectory() ? '/' : '')}">${file}</a>
                </li>
              `;
                if (stat.isDirectory()) {
                  dirList.push(item);
                } else {
                  fileList.push(item);
                }
              }

              if (fileList.length + dirList.length + errList.length == files.length) {
                let html = `
              <!DOCTYPE html>
              <html>
                <head>
                  <meta charset="utf-8">
                  <title>${req.url}</title>
                </head>
                <body>
                  ${fileList.length ? '<h2>文件</h2>' : ''}
                  <ul> ${fileList.join('')} </ul>
                  ${dirList.length ? '<h2>目录</h2>' : ''}
                  <ul> ${dirList.join('')} </ul>
                  ${errList.length ? '<h2>失败</h2>' : ''}
                  <ul> ${errList.join('')} </ul>
                </body>
              </html>
              `;
                compress(req, res, html).then(compressedHtml => {
                  res.writeHead(200, {
                    "Content-Type": "text/html"
                  });
                  res.end(compressedHtml);
                }, err => res.end(JSON.stringify(err)));
              }
            }));
          });
        } else { // 是一个文件
          absPath = absPath.replace(/[\\\/]*$/, '');
          let rStream = fs.createReadStream(absPath);
          rStream.on('error', e => res.end(JSON.stringify(err)));
          res.setHeader("Content-Type", `${mime.lookup(absPath)}; charset=utf-8`);
          res.on('close', () => typeof rStream.destroy == 'function' && rStream.destroy())
          compress(req, res, rStream);
        }
      } else {
        res.end(JSON.stringify(err));
      }
    }));
}

// deflate、gzip 压缩
function compress(req, res, data) {
  let acceptEncoding = req.headers['accept-encoding'];
  if (!acceptEncoding) {
    acceptEncoding = '';
  }

  return new Promise((resolve, reject) => {
    if (acceptEncoding.match(/\bgzip\b/)) {
      res.setHeader('Content-Encoding', 'gzip');
      if (data instanceof stream.Readable) {
        res.writeHead(200, {});
        resolve(data.pipe(zlib.createGzip()).pipe(res));
      } else {
        zlib.gzip(data, (err, data) => {
          if (!err) {
            resolve(data);
          } else {
            reject(err);
          }
        })
      }
    } else if (acceptEncoding.match(/\bdeflate\b/)) {
      res.setHeader('Content-Encoding', 'deflate');
      if (data instanceof stream.Readable) {
        res.writeHead(200, {});
        resolve(data.pipe(zlib.createDeflate()).pipe(res));
      } else {
        zlib.deflate(data, (err, data) => {
          if (!err) {
            resolve(data);
          } else {
            reject(err);
          }
        })
      }
    } else {
      resolve(data);
    }
  })
}
