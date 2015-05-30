
/**
 * Caro-FS
 * @author Caro.Huang
 */
var caro, getArgs, nFs, nPath, self, showErr, traceMode;

self = {};

traceMode = false;

nFs = require('fs');

nPath = require('path');

caro = require('caro');

getArgs = function(args) {
  var aArr, aBool, aFn, aNum, aStr;
  aStr = [];
  aFn = [];
  aBool = [];
  aArr = [];
  aNum = [];
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
      return aNum.push(arg);
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
