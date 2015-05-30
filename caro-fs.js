
/**
 * Caro-FS
 * @author Caro.Huang
 */
var caro, nFs, nPath, self, showErr, traceMode;

self = {};

traceMode = false;

nFs = require('fs');

nPath = require('path');

caro = require('caro');

showErr = function(e) {
  if (traceMode) {
    return console.error(e);
  }
};


/**
 * set trace-mode, will console.error when got exception
 * @returns {boolean}
 */

self.setFsTrace = function(bool) {
  return traceMode = bool === true;
};

module.exports = self;


/**
 * Dir
 */
var coverToFalseIfEmptyArr, getArgs;

getArgs = function(args) {
  var aArr, aBool, aFn, aNum, aStr;
  aStr = [];
  aFn = [];
  aBool = [];
  aArr = [];
  aNum = [];
  caro.each(args, function(i, arg) {
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
      return;
    }
  });
  return {
    fn: aFn,
    bool: aBool,
    str: aStr,
    arr: aArr,
    num: aNum
  };
};

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
  caro.each(aPath, function(i, path) {
    var count, e;
    try {
      count = nFs.readdirSync(path);
      if (count.length > 0) {
        pass = false;
      }
      caro.executeIfFn(cb, false, path);
    } catch (_error) {
      e = _error;
      showErr(e);
      pass = false;
      caro.executeIfFn(cb, e, path);
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

self.readDirCb = function(path, cb, opt) {
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
      caro.each(r, function(i, extendName) {
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
    caro.each(files, function(i, basename) {
      var dirPath, extendName, filePath, fileType, filename, fullDirPath, fullPath, oFileInfo;
      filename = caro.getFileName(basename, false);
      extendName = caro.getExtendName(basename);
      filePath = caro.normalizePath(rootPath, basename);
      dirPath = caro.getDirPath(filePath);
      fullPath = caro.coverToFullPath(filePath);
      fullDirPath = caro.getDirPath(fullPath);
      fileType = caro.getFileType(filePath);
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
      if (caro.isFsDir(filePath)) {
        if (getDir && pushFile(oFileInfo) === false) {
          return false;
        }
        readDir(filePath, layer);
        return;
      }
      if (caro.isFsFile(filePath) && getFile && pushFile(oFileInfo) === false) {
        return false;
      }
    });
  };
  readDir(path, countLayer);
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
    caro.each(aPath, function(i, eachDir) {
      var e, exists;
      subPath = caro.normalizePath(subPath, eachDir);
      exists = caro.fsExists(subPath);
      if (exists) {
        return;
      }
      try {
        nFs.mkdirSync(subPath);
      } catch (_error) {
        e = _error;
        showErr(e);
        pass = false;
        err.push(e);
      }
    });
    return err;
  };
  caro.each(aPath, function(i, dirPath) {
    err = [];
    err = createDir(dirPath);
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
 * @param {?string} [encoding=utf8]
 * @param {?string} [flag=null]
 * @returns {*}
 */
self.readFileCaro = function(path, encoding, flag) {
  var e;
  if (encoding == null) {
    encoding = 'utf8';
  }
  if (flag == null) {
    flag = null;
  }
  try {
    return nFs.readFileSync(path, {
      encoding: encoding,
      flag: flag
    });
  } catch (_error) {
    e = _error;
    showErr(e);
  }
  return false;
};


/**
 * write data to file, return false if failed
 * @param {string} path
 * @param {*} data
 * @param {?string} [encoding=utf8]
 * @param {?string} [flag=null]
 * @returns {*}
 */

self.writeFileCaro = function(path, data, encoding, flag) {
  var e;
  if (encoding == null) {
    encoding = 'utf8';
  }
  if (flag == null) {
    flag = null;
  }
  try {
    nFs.writeFileSync(path, data, {
      encoding: encoding,
      flag: flag
    });
    return true;
  } catch (_error) {
    e = _error;
    showErr(e);
  }
  return false;
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
  caro.each(arguments, function(i, val) {
    val = caro.normalizePath(val);
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
    extendName = caro.getExtendName(path);
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
  path = caro.normalizePath.apply(this, arguments);
  if (!caro.isFullPath(path)) {
    path = nPath.join(absolutePath, path);
  }
  return path;
};


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
  caro.each(aPath, function(i, path) {
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
    caro.executeIfFn(cb, err, path);
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
  caro.each(aPath, function(i, path) {
    var e, err, stat;
    err = false;
    try {
      stat = caro.getFsStat(path);
      pass && (pass = stat.isDirectory());
    } catch (_error) {
      e = _error;
      showErr(e);
      pass = false;
      err = e;
    }
    caro.executeIfFn(cb, err, path);
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
  caro.each(aPath, function(i, path) {
    var e, err, stat;
    err = false;
    try {
      stat = caro.getFsStat(path);
      pass && (pass = stat.isFile());
    } catch (_error) {
      e = _error;
      showErr(e);
      pass = false;
      err = e;
    }
    caro.executeIfFn(cb, err, path);
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
  caro.each(aPath, function(i, path) {
    var e, err, stat;
    err = false;
    try {
      stat = caro.getFsStat(path);
      pass && (pass = stat.isSymbolicLink());
    } catch (_error) {
      e = _error;
      showErr(e);
      pass = false;
      err = e;
    }
    caro.executeIfFn(cb, err, path);
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
  if (caro.isFsDir(path)) {
    r = 'dir';
  }
  if (caro.isFsFile(path)) {
    r = 'file';
  }
  if (caro.isFsSymlink(path)) {
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
      fn();
    } catch (_error) {
      e = _error;
      showErr(e);
      pass = false;
      err.push(e);
    }
  };
  deleteFileOrDir = function(path) {
    if (caro.isFsFile(path) && force) {
      tryAndCatchErr(function() {
        return nFs.unlinkSync(path);
      });
      return;
    }
    if (caro.isFsDir(path)) {
      tryAndCatchErr(function() {
        var files;
        files = nFs.readdirSync(path);
        caro.each(files, function(i, file) {
          var subPath;
          subPath = caro.normalizePath(path, file);
          deleteFileOrDir(subPath);
        });
      });
    }
    tryAndCatchErr(function() {
      return nFs.rmdirSync(path);
    });
    return err;
  };
  caro.each(aPath, function(i, dirPath) {
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
  caro.each(aPathMap, function(i, pathMap) {
    var dirPath2, e, err, path1, path2;
    err = false;
    path1 = pathMap[0];
    path2 = pathMap[1];
    try {
      if (force && caro.fsExists(path1)) {
        dirPath2 = caro.getDirPath(path2);
        caro.createDir(dirPath2);
      }
      nFs.renameSync(path1, path2);
    } catch (_error) {
      e = _error;
      showErr(e);
      pass = false;
      err = e;
    }
    caro.executeIfFn(cb, err, path1, path2);
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
  args = caro.objToArr(arguments);
  args.shift();
  args = getArgs(args);
  fixed = caro.coverToInt(args.num[0]);
  fixed = fixed > -1 ? fixed : 1;
  unit = args.str[0];
  si = true;
  unit = caro.upperFirst(unit);
  unit = caro.upperStr(unit, {
    start: -1
  });
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
  return caro.coverToNum(bytes.toFixed(fixed));
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
