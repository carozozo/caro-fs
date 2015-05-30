
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
