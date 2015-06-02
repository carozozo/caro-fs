
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
  var args, data, e, err;
  data = null;
  err = false;
  args = caro.classify(arguments);
  opt = args.obj[0] || {};
  cb = args.fn[0] || null;
  try {
    data = nFs.readFileSync(path, opt, cb);
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
  var args, e, err;
  err = false;
  args = caro.classify(arguments);
  opt = args.obj[0] || {};
  cb = args.fn[0] || null;
  try {
    nFs.writeFileSync(path, data, opt);
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
  args = caro.classify(arguments);
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
  args = caro.classify(args);
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
