
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
