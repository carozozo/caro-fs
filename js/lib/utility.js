
/**
 * FileSystem
 */

/**
 * get file stat
 * @param {string} path
 * @param {string} [type=l] s = statSync, l = lstatSync, f = fstatSync
 * @returns {*}
 */
self.getStat = function(path, type) {
  var aType, e, stat;
  if (type == null) {
    type = 'l';
  }
  stat = null;
  aType = ['l', 's', 'f'];
  type = aType.indexOf(type) > -1 ? type : aType[0];
  try {
    switch (type) {
      case 's':
        stat = nFs.lstatSync(path);
        break;
      case 'f':
        stat = nFs.fstatSync(path);
        break;
      default:
        stat = nFs.statSync(path);
        break;
    }
  } catch (_error) {
    e = _error;
    showErr(e);
  }
  return stat;
};


/**
 * check file if exists, return false when anyone is false
 * @param {...string} path
 * @param {function} [cb] the callback-function for each path
 * @returns {*}
 */

self.exists = function(path, cb) {
  var aPath, allPass, args;
  allPass = true;
  args = getArgs(arguments);
  aPath = args.str;
  cb = args.fn[0];
  caro.forEach(aPath, function(path) {
    var e, err, pass;
    pass = true;
    err = false;
    try {
      if (!nFs.existsSync(path)) {
        allPass = false;
        pass = false;
      }
    } catch (_error) {
      e = _error;
      showErr(e);
      allPass = false;
      pass = false;
      err = e;
    }
    return caro.executeIfFn(cb, err, path, pass);
  });
  return allPass;
};


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


/**
 * delete file/folder recursively
 * @param {...string} path
 * @param {function} [cb] the callback-function for each path
 * @param {boolean} [force=false] force-delete even not empty
 * @returns {boolean}
 */

self.deleteFs = function(path, cb, force) {
  var aPath, args, deleteFileOrDir, err, pass, tryAndCatchErr;
  err = [];
  pass = true;
  args = getArgs(arguments);
  aPath = args.str;
  cb = args.fn[0];
  force = args.bool[0] || false;
  tryAndCatchErr = function(fn) {
    var e;
    try {
      return fn();
    } catch (_error) {
      e = _error;
      showErr(e);
      pass = false;
      return err.push(e);
    }
  };
  deleteFileOrDir = function(path) {
    if (self.isFile(path)) {
      tryAndCatchErr(function() {
        return nFs.unlinkSync(path);
      });
      return;
    }
    if (self.isDir(path) && force) {
      tryAndCatchErr(function() {
        var files;
        files = nFs.readdirSync(path);
        return caro.forEach(files, function(file) {
          var subPath;
          subPath = self.normalizePath(path, file);
          return deleteFileOrDir(subPath);
        });
      });
    }
    tryAndCatchErr(function() {
      return nFs.rmdirSync(path);
    });
    return err;
  };
  caro.forEach(aPath, function(dirPath) {
    err = [];
    deleteFileOrDir(dirPath);
    err = coverToFalseIfEmptyArr(err);
    return caro.executeIfFn(cb, err, dirPath);
  });
  return pass;
};


/**
 * @param {string|...[]} path the file-path, you can also set as [path,newPath]
 * @param {string|...[]} newPath the new-path, you can also set as [path,newPath]
 * @param {function} [cb] the callback-function for each path
 * @param {boolean} [force=false] will create folder if there is no path for newPath
 * @returns {boolean}
 */

self.renameFs = function(path, newPath, cb, force) {
  var aPathMap, args, pass;
  pass = true;
  aPathMap = [];
  args = getArgs(arguments);
  cb = args.fn[0];
  force = args.bool[0] || false;
  aPathMap = (function() {
    if (caro.isString(path) && caro.isString(newPath)) {
      return [[path, newPath]];
    }
    return args.arr;
  })();
  caro.forEach(aPathMap, function(pathMap) {
    var dirPath2, e, err, path1, path2;
    err = false;
    path1 = pathMap[0];
    path2 = pathMap[1];
    try {
      if (force && self.exists(path1)) {
        dirPath2 = self.getDirPath(path2);
        self.createDir(dirPath2);
      }
      nFs.renameSync(path1, path2);
    } catch (_error) {
      e = _error;
      showErr(e);
      pass = false;
      err = e;
    }
    return caro.executeIfFn(cb, err, path1, path2);
  });
  return pass;
};
