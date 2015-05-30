
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
