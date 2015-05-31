
/**
 * TypeCheck
 */

/**
 * check if folder, return false when anyone is false
 * @param {...string} path
 * @param {function} [cb] the callback-function for each path
 * @returns {*}
 */
self.isDir = function(path, cb) {
  var aPath, allPass, args;
  allPass = true;
  args = getArgs(arguments);
  aPath = args.str;
  cb = args.fn[0];
  caro.forEach(aPath, function(path) {
    var e, err, pass, stat;
    pass = true;
    err = false;
    try {
      stat = self.getStat(path);
    } catch (_error) {
      e = _error;
      showErr(e);
      allPass = false;
      pass = false;
      err = e;
    }
    if (!stat || !stat.isDirectory()) {
      allPass = false;
      pass = false;
    }
    return caro.executeIfFn(cb, err, path, pass);
  });
  return allPass;
};


/**
 * check if file, return false when anyone is false
 * @param {...string} path
 * @param {function} [cb] the callback-function for each path
 * @returns {*}
 */

self.isFile = function(path) {
  var aPath, allPass, args, cb;
  allPass = true;
  args = getArgs(arguments);
  aPath = args.str;
  cb = args.fn[0];
  caro.forEach(aPath, function(path) {
    var e, err, pass, stat;
    pass = true;
    err = false;
    try {
      stat = self.getStat(path);
    } catch (_error) {
      e = _error;
      showErr(e);
      allPass = false;
      pass = false;
      err = e;
    }
    if (!stat || !stat.isFile()) {
      allPass = false;
      pass = false;
    }
    return caro.executeIfFn(cb, err, path, pass);
  });
  return allPass;
};


/**
 * check if symbolic link, return false when anyone is false
 * @param {function} [cb] the callback-function for each path
 * @param {...string} path
 * @returns {*}
 */

self.isSymlink = function(path) {
  var aPath, allPass, args, cb;
  allPass = true;
  args = getArgs(arguments);
  aPath = args.str;
  cb = args.fn[0];
  caro.forEach(aPath, function(path) {
    var e, err, pass, stat;
    pass = true;
    err = false;
    try {
      stat = self.getStat(path);
    } catch (_error) {
      e = _error;
      showErr(e);
      allPass = false;
      pass = false;
      err = e;
    }
    if (!stat || !stat.isSymbolicLink()) {
      allPass = false;
      pass = false;
    }
    return caro.executeIfFn(cb, err, path, pass);
  });
  return allPass;
};


/**
 * @param {string} path
 * @returns {string}
 */

self.getFileType = function(path) {
  var r;
  r = '';
  if (self.isDir(path)) {
    r = 'dir';
  } else if (self.isFile(path)) {
    r = 'file';
  } else if (self.isSymlink(path)) {
    r = 'link';
  }
  return r;
};
