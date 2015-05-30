(function() {
  var cf;
  cf = typeof _ !== "undefined" && _ !== null ? _ : {};
  module.exports = cf;
  return global.cf = cf;
})();


/**
 * FileSystem
 * @author Caro.Huang
 */
(function() {
  var caro, coverToFalseIfEmptyArr, fileSizeUnits1, fileSizeUnits2, getArgs, getFileSize, nFs, self, showErr, traceMode;
  self = cf;
  caro = require('caro');
  nFs = require('fs');
  fileSizeUnits1 = ['KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  fileSizeUnits2 = ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];
  traceMode = false;
  showErr = function(e) {
    if (traceMode) {
      return console.error(e);
    }
  };
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
  getFileSize = function(path) {
    var status;
    status = caro.getFsStat(path);
    if (status) {
      return status.size;
    }
    if (caro.isNumber(path)) {
      return path;
    }
    return null;
  };

  /**
   * set trace-mode, will console.error when got exception
   * @returns {boolean}
   */
  self.setFsTrace = function(bool) {
    return traceMode = bool === true;
  };

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
})();


/**
 * Path
 * @author Caro.Huang
 */
(function() {
  var absolutePath, caro, nPath, self;
  self = cf;
  caro = require('caro');
  nPath = require('path');
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
    return absolutePath = caro.normalizePath(path);
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
    var args;
    args = caro.objToArr(arguments);
    return nPath.join.apply(nPath, args);
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
})();
