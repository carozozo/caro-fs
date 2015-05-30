
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
