
/**
 * FileSystem
 */
var fileSizeUnits1, fileSizeUnits2;

fileSizeUnits1 = ['KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

fileSizeUnits2 = ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];


/**
 * check file if exists, return false when anyone is false
 * @param {...string} path
 * @param {function} [cb] the callback-function for each path
 * @returns {*}
 */

self.fsExists = function(path, cb) {
  var aPath, args, pass;
  pass = true;
  args = getArgs(arguments);
  aPath = args.str;
  cb = args.fn[0];
  caro.forEach(aPath, function(path) {
    var e, err;
    err = false;
    try {
      if (!nFs.existsSync(path)) {
        pass = false;
      }
    } catch (_error) {
      e = _error;
      showErr(e);
      pass = false;
      err = e;
    }
    return caro.executeIfFn(cb, err, path);
  });
  return pass;
};


/**
 * check if folder, return false when anyone is false
 * @param {...string} path
 * @param {function} [cb] the callback-function for each path
 * @returns {*}
 */

self.isFsDir = function(path, cb) {
  var aPath, args, pass;
  pass = true;
  args = getArgs(arguments);
  aPath = args.str;
  cb = args.fn[0];
  caro.forEach(aPath, function(path) {
    var e, err, stat;
    err = false;
    try {
      stat = self.getFsStat(path);
      pass && (pass = stat.isDirectory());
    } catch (_error) {
      e = _error;
      showErr(e);
      pass = false;
      err = e;
    }
    return caro.executeIfFn(cb, err, path);
  });
  return pass;
};


/**
 * check if file, return false when anyone is false
 * @param {...string} path
 * @param {function} [cb] the callback-function for each path
 * @returns {*}
 */

self.isFsFile = function(path) {
  var aPath, args, cb, pass;
  pass = true;
  args = getArgs(arguments);
  aPath = args.str;
  cb = args.fn[0];
  caro.forEach(aPath, function(path) {
    var e, err, stat;
    err = false;
    try {
      stat = self.getFsStat(path);
      pass && (pass = stat.isFile());
    } catch (_error) {
      e = _error;
      showErr(e);
      pass = false;
      err = e;
    }
    return caro.executeIfFn(cb, err, path);
  });
  return pass;
};


/**
 * check if symbolic link, return false when anyone is false
 * @param {function} [cb] the callback-function for each path
 * @param {...string} path
 * @returns {*}
 */

self.isFsSymlink = function(path) {
  var aPath, args, cb, pass;
  pass = true;
  args = getArgs(arguments);
  aPath = args.str;
  cb = args.fn[0];
  caro.forEach(aPath, function(path) {
    var e, err, stat;
    err = false;
    try {
      stat = self.getFsStat(path);
      pass && (pass = stat.isSymbolicLink());
    } catch (_error) {
      e = _error;
      showErr(e);
      pass = false;
      err = e;
    }
    return caro.executeIfFn(cb, err, path);
  });
  return pass;
};


/**
 * @param {string} path
 * @returns {string}
 */

self.getFileType = function(path) {
  var r;
  r = '';
  if (self.isFsDir(path)) {
    r = 'dir';
  }
  if (self.isFsFile(path)) {
    r = 'file';
  }
  if (self.isFsSymlink(path)) {
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
  force = args.bool[0];
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
    if (self.isFsFile(path) && force) {
      tryAndCatchErr(function() {
        return nFs.unlinkSync(path);
      });
      return;
    }
    if (self.isFsDir(path)) {
      tryAndCatchErr(function() {
        var files;
        files = nFs.readdirSync(path);
        return caro.forEach(files, function(file) {
          var subPath;
          subPath = caro.normalizePath(path, file);
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
    err = deleteFileOrDir(dirPath);
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
  if (force == null) {
    force = false;
  }
  pass = true;
  aPathMap = [];
  args = getArgs(arguments);
  cb = args.fn[0];
  force = args.bool[0];
  aPathMap = (function() {
    if (caro.isString(path) && caro.isString(newPath)) {
      return [path, newPath];
    }
    return args.arr;
  })();
  caro.forEach(aPathMap, function(pathMap) {
    var dirPath2, e, err, path1, path2;
    err = false;
    path1 = pathMap[0];
    path2 = pathMap[1];
    try {
      if (force && self.fsExists(path1)) {
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


/**
 * get file stat
 * @param {string} path
 * @param {string} [type=l] s = statSync, l = lstatSync, f = fstatSync
 * @returns {*}
 */

self.getFsStat = function(path, type) {
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
 * get file size, default in bytes or set by unit
 * @param {number|string} path file-path or bytes
 * @param {number} [fixed=1] decimals of float
 * @param {string} [unit] the file-size unit
 * @returns {}
 */

self.getFsSize = function(path, fixed, unit) {
  var args, bytes, count, index, index1, index2, si, thresh;
  if (fixed == null) {
    fixed = 1;
  }
  bytes = getFileSize(path);
  if (bytes === null) {
    return bytes;
  }
  args = args.drop(arguments);
  args = getArgs(args);
  fixed = caro.toInteger(args.num[0]);
  fixed = fixed > -1 ? fixed : 1;
  unit = args.str[0];
  si = true;
  unit = caro.capitalize(unit);
  unit = caro.upperStr(unit, -1);
  index1 = fileSizeUnits1.indexOf(unit);
  index2 = fileSizeUnits2.indexOf(unit);
  if (index2 > -1) {
    si = false;
  }
  index = si ? index1 : index2;
  if (index < 0) {
    return bytes;
  }
  count = 0;
  thresh = si ? 1000 : 1024;
  while (count < index) {
    bytes /= thresh;
    ++count;
  }
  return caro.toNumber(caro.toFixedNumber(bytes, fixed));
};


/**
 * get file size for human-reading
 * @param {number|string} path file-path or bytes
 * @param {number} [fixed=1] decimals of float
 * @param {boolean} [si=true] size-type, true decimal, false as binary
 * @returns {string}
 */

self.humanFeSize = function(path, fixed, si) {
  var aUnit, bytes, thresh, u;
  if (fixed == null) {
    fixed = 1;
  }
  if (si == null) {
    si = true;
  }
  bytes = getFileSize(path);
  if (bytes === null) {
    return bytes;
  }
  thresh = si ? 1000 : 1024;
  if (bytes < thresh) {
    return bytes + ' B';
  }
  aUnit = si ? fileSizeUnits1 : fileSizeUnits2;
  u = -1;
  while (bytes >= thresh) {
    bytes /= thresh;
    ++u;
  }
  return caro.coverToFixed(bytes, fixed) + ' ' + aUnit[u];
};
