
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
