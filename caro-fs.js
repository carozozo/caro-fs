
/**
 * Caro-FS
 * @author Caro.Huang
 */
var caro, fileSizeUnits1, fileSizeUnits2, getArgs, getFileSize, nFs, nPath, self, showErr, traceMode;

self = {};

traceMode = false;

nFs = require('fs');

nPath = require('path');

caro = require('caro');

fileSizeUnits1 = ['KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

fileSizeUnits2 = ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];

getArgs = function(args) {
  var aArr, aBool, aFn, aNum, aObj, aStr;
  aStr = [];
  aFn = [];
  aBool = [];
  aArr = [];
  aNum = [];
  aObj = [];
  caro.forEach(args, function(arg) {
    if (caro.isFunction(arg)) {
      aFn.push(arg);
      return;
    }
    if (caro.isBoolean(arg)) {
      aBool.push(arg);
      return;
    }
    if (caro.isString(arg)) {
      aStr.push(arg);
      return;
    }
    if (caro.isArray(arg)) {
      aArr.push(arg);
      return;
    }
    if (caro.isNumber(arg)) {
      aNum.push(arg);
    }
    if (caro.isPlainObject(arg)) {
      return aObj.push(arg);
    }
  });
  return {
    fn: aFn,
    bool: aBool,
    str: aStr,
    arr: aArr,
    num: aNum,
    obj: aObj
  };
};

showErr = function(e) {
  if (traceMode) {
    return console.error(e);
  }
};

getFileSize = function(path) {
  var status;
  if (caro.isNumber(path)) {
    return path;
  }
  status = self.getStat(path);
  if (status) {
    return status.size;
  }
  return null;
};


/**
 * set trace-mode, will console.error when got exception
 * @returns {boolean} [bool=false]
 */

self.setFsTrace = function(bool) {
  return traceMode = bool === true;
};

module.exports = self;


/**
 * Dir
 */
var coverToFalseIfEmptyArr;

coverToFalseIfEmptyArr = function(arr) {
  if (arr.length < 1) {
    return false;
  }
  return arr;
};


/**
 * check if empty-folder, return false if anyone is false
 * @param {...string} path
 * @param {function} [cb] the callback-function for each path
 * @returns {boolean}
 */

self.isEmptyDir = function(path, cb) {
  var aPath, args, pass;
  pass = true;
  args = getArgs(arguments);
  aPath = args.str;
  cb = args.fn[0];
  caro.forEach(aPath, function(path) {
    var count, e;
    try {
      count = nFs.readdirSync(path);
      if (count.length > 0) {
        pass = false;
      }
      return caro.executeIfFn(cb, false, path);
    } catch (_error) {
      e = _error;
      showErr(e);
      pass = false;
      return caro.executeIfFn(cb, e, path);
    }
  });
  return pass;
};


/**
 * get files under path
 * @param {string} path
 * @param {function(object)} [cb] cb with file-info
 * @param {object} [opt]
 * @param {number} [opt.maxLayer=1] the dir-layer you want to read, get all-layer when 0
 * @param {boolean} [opt.getDir=true] if return dir-path
 * @param {boolean} [opt.getFile=true] if return file-path
 * @param {boolean|string|[]} [opt.getByExtend=false] if set as string, will only return files including same extend-name
 * @returns {*}
 */

self.readDir = function(path, cb, opt) {
  var countLayer, getByExtend, getDir, getFile, maxLayer, pushFile, readDir;
  if (opt == null) {
    opt = {};
  }
  countLayer = 0;
  maxLayer = opt.maxLayer != null ? parseInt(opt.maxLayer, 10) : 1;
  getDir = opt.getDir !== false;
  getFile = opt.getFile !== false;
  getByExtend = (function() {
    var r;
    r = false;
    if (opt.getByExtend) {
      r = caro.splitStr(opt.getByExtend, ',');
      caro.forEach(r, function(extendName, i) {
        r[i] = caro.addHead(extendName, '.');
      });
    }
    return r;
  })();
  pushFile = function(oFileInfo) {
    var extendName;
    extendName = oFileInfo.extendName;
    if (getByExtend && getByExtend.indexOf(extendName) < 0) {
      return;
    }
    return cb(false, oFileInfo);
  };
  readDir = function(rootPath, layer) {
    var e, files;
    if (maxLayer > 0 && layer >= maxLayer) {
      return;
    }
    try {
      files = nFs.readdirSync(rootPath);
    } catch (_error) {
      e = _error;
      showErr(e);
      cb(e);
    }
    layer++;
    return caro.forEach(files, function(basename, i) {
      var dirPath, extendName, filePath, fileType, filename, fullDirPath, fullPath, oFileInfo;
      filename = self.getFileName(basename, false);
      extendName = self.getExtendName(basename);
      filePath = self.normalizePath(rootPath, basename);
      dirPath = self.getDirPath(filePath);
      fullPath = self.coverToFullPath(filePath);
      fullDirPath = self.getDirPath(fullPath);
      fileType = self.getFileType(filePath);
      oFileInfo = {
        filename: filename,
        extendName: extendName,
        basename: basename,
        filePath: filePath,
        dirPath: dirPath,
        fullPath: fullPath,
        fullDirPath: fullDirPath,
        fileType: fileType,
        layer: layer - 1,
        index: i
      };
      if (self.isDir(filePath)) {
        if (getDir && pushFile(oFileInfo) === false) {
          return false;
        }
        readDir(filePath, layer);
        return;
      }
      if (self.isFile(filePath) && getFile && pushFile(oFileInfo) === false) {
        return false;
      }
    });
  };
  readDir(path, countLayer);
  return null;
};


/**
 * create dir recursively, will create folder if path not exists
 * @param {...string} path
 * @param {function} [cb] the callback-function for each path
 * @returns {*|string}
 */

self.createDir = function(path, cb) {
  var aPath, args, createDir, err, pass;
  err = [];
  pass = true;
  args = getArgs(arguments);
  aPath = args.str;
  cb = args.fn[0];
  createDir = function(dirPath) {
    var subPath;
    subPath = '';
    aPath = caro.splitStr(dirPath, ['\\', '/']);
    return caro.forEach(aPath, function(eachDir) {
      var e, exists;
      subPath = self.normalizePath(subPath, eachDir);
      exists = self.exists(subPath);
      if (exists) {
        return;
      }
      try {
        return nFs.mkdirSync(subPath);
      } catch (_error) {
        e = _error;
        showErr(e);
        pass = false;
        return err.push(e);
      }
    });
  };
  caro.forEach(aPath, function(dirPath) {
    err = [];
    createDir(dirPath);
    err = coverToFalseIfEmptyArr(err);
    return caro.executeIfFn(cb, err, dirPath);
  });
  return pass;
};


/**
 * File
 */

/**
 * read file content, return false if failed
 * @param {string} path
 * @param {function} [cb] the callback function that passing error and data
 * @param {object} [opt]
 * @param {string} [opt.encoding=null]
 * @param {string} [opt.flag=null]
 * @returns {*}
 */
self.readFile = function(path, cb, opt) {
  var args, data, e, encoding, err, flag;
  data = null;
  err = false;
  args = getArgs(arguments);
  opt = args.obj[0] || {};
  cb = args.fn[0] || null;
  encoding = opt.encoding || null;
  flag = opt.flag || null;
  try {
    data = nFs.readFileSync(path, {
      encoding: encoding,
      flag: flag
    });
  } catch (_error) {
    e = _error;
    showErr(e);
    err = e;
  }
  caro.executeIfFn(cb, err, data);
  return data;
};


/**
 * write data to file, return false if failed
 * @param {string} path
 * @param {*} data
 * @param {function} [cb] the callback function that passing error
 * @param {object} [opt]
 * @param {string} [opt.encoding=null]
 * @param {string} [opt.flag=null]
 * @param {int} [mode=null]
 * @returns {*}
 */

self.writeFile = function(path, data, cb, opt) {
  var args, e, encoding, err, flag, mode;
  err = false;
  args = getArgs(arguments);
  opt = args.obj[0] || {};
  cb = args.fn[0] || null;
  encoding = opt.encoding || null;
  flag = opt.flag || null;
  mode = opt.mode || null;
  try {
    nFs.writeFileSync(path, data, {
      encoding: encoding,
      flag: flag,
      mode: mode
    });
    return true;
  } catch (_error) {
    e = _error;
    showErr(e);
    err = e;
  }
  caro.executeIfFn(cb, err);
  return !err;
};


/**
 * copy file, return false if failed
 * @param {string} path
 * @param {string} newPath
 * @param {function} [cb] the callback function that passing error
 * @param {object} [opt]
 * @param {string} [opt.encoding=null]
 * @param {string} [opt.flag=null]
 * @returns {*}
 */

self.copyFile = function(path, newPath, cb, opt) {
  var args, data, e, err;
  err = false;
  args = getArgs(arguments);
  opt = args.obj[0] || {};
  cb = args.fn[0] || null;
  try {
    data = self.readFile(path, function(e) {
      if (e) {
        return err = e;
      }
    }, opt);
    if (!err) {
      self.writeFile(newPath, data, opt);
    }
  } catch (_error) {
    e = _error;
    showErr(e);
    err = e;
  }
  caro.executeIfFn(cb, err);
  return !err;
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
  args = caro.drop(arguments);
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
  return caro.toFixedNumber(bytes, fixed) + ' ' + aUnit[u];
};


/**
 * Path
 */
var absolutePath;

absolutePath = typeof __dirname !== 'undefined' ? __dirname : '';


/**
 * set absolute root path
 * @param path
 * @returns {String}
 */

self.setAbsolutePath = function(path) {
  if (!caro.isString(path)) {
    return false;
  }
  return absolutePath = self.normalizePath(path);
};


/**
 * get absolute root path
 * @returns {String}
 */

self.getAbsolutePath = function() {
  return absolutePath;
};


/**
   * @param {...} path
   * @returns {string|*}
 */

self.normalizePath = function(path) {
  return nPath.join.apply(nPath, arguments);
};


/**
 * check if path contain absolute root path
 * @param {*...} path
 * @returns {boolean}
 */

self.isFullPath = function(path) {
  var pass;
  pass = true;
  caro.forEach(arguments, function(val) {
    val = self.normalizePath(val);
    if (val.indexOf(absolutePath) !== 0) {
      pass = false;
      return false;
    }
  });
  return pass;
};


/**
 * get dir-path of path
 * @param {string} path
 * @returns {string}
 */

self.getDirPath = function(path) {
  return nPath.dirname(path);
};


/**
 * get file name from path
 * @param {string} path
 * @param {boolean} [getFull=true] return basename if true
 * @returns {*}
 */

self.getFileName = function(path, getFull) {
  var extendName;
  if (getFull == null) {
    getFull = true;
  }
  if (!getFull) {
    extendName = self.getExtendName(path);
    return nPath.basename(path, extendName);
  }
  return nPath.basename(path);
};


/**
 * EX
 * getExtendName('aa/bb/cc.txt') => get '.txt'
 * @param path
 * @param {boolean} [withDot=true]
 * @returns {*}
 */

self.getExtendName = function(path, withDot) {
  var extendName;
  if (withDot == null) {
    withDot = true;
  }
  extendName = nPath.extname(path);
  if (!withDot) {
    extendName = extendName.replace('.', '');
  }
  return extendName;
};


/**
 * auto add server root-path if not exist
 * @param {...} path
 * @returns {*|string}
 */

self.coverToFullPath = function(path) {
  path = self.normalizePath.apply(this, arguments);
  if (!self.isFullPath(path)) {
    path = nPath.join(absolutePath, path);
  }
  return path;
};


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


/**
 * Utility
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
    return tryAndCatchErr(function() {
      return nFs.rmdirSync(path);
    });
  };
  caro.forEach(aPath, function(eachPath) {
    err = [];
    deleteFileOrDir(eachPath);
    err = coverToFalseIfEmptyArr(err);
    return caro.executeIfFn(cb, err, eachPath);
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
