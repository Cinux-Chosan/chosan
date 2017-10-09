exports.parseArgv = function(originArgs = []) {
  let oArgs = {
    originArgs,
    has(name) {
      return originArgs.includes(name);
    }
  };
  originArgs.forEach(el => {
    el = el.split('=');
    if (el.length > 1) {
      oArgs[el[0]] = el[1];
    }
  });

  return oArgs;
}


exports.json = obj => JSON.stringify(obj);
exports.jp = str => JSON.parse(str);
