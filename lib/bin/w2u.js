let vfs = require('vinyl-fs');
let map = require('map-stream');
let path = require('path');

function replaceLinebreaks (file, cb) {
  //  console.log(file.path);
  let str = file.contents.toString().replace(/\r\n$/g, '\n');
  file.contents = new Buffer(str, 'utf-8');
  cb(null, file);
}

let args = process.argv;

if (!args[2]) {
  dir = '.';
} else {
  dir = path.join(process.cwd(), args[2]);
}

let ignoresDefault = ['node_modules', 'bower_components', 'dist', 'tmp'];
let ignores = process.argv.slice(3);
if (!ignores.length) {
  ignores = ignoresDefault;
}

vfs.src([`${dir}/**/*.*`, `!${dir}/**/(${ignores.join('|')})/**/*.*`])
  .pipe(map(replaceLinebreaks))
  .pipe(vfs.dest('./'));
