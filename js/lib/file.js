
/**
 * File
 */

/**
 * read file content, return false if failed
 * @param {string} path
 * @param {function} [cb] the callback function that passing error and data
 * @param {object} [opt]
 * @param {string} [opt.encoding=utf8]
 * @param {string} [opt.flag=null]
 * @returns {*}
 */
self.readFile = function(path, opt, cb) {
  var args, data, e, encoding, err, flag;
  data = false;
  err = false;
  args = getArgs(arguments);
  opt = args.obj[0] || {};
  cb = args.fn[0] || null;
  encoding = opt.encoding || 'utf8';
  flag = opt.flag || flag;
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
 * @param {string} [encoding=utf8]
 * @param {string} [flag=null]
 * @returns {*}
 */

self.writeFile = function(path, data, encoding, flag) {
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
