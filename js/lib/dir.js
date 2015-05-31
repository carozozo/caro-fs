
/**
 * Dir
 */
var coverToFalseIfEmptyArr;

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
  caro.forEach(aPath, function(path) {
    var count, e;
    try {
      count = nFs.readdirSync(path);
      if (count.length > 0) {
        pass = false;
      }
      return caro.executeIfFn(cb, false, path);
    } catch (_error) {
      e = _error;
      showErr(e);
      pass = false;
      return caro.executeIfFn(cb, e, path);
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

self.readDir = function(path, cb, opt) {
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
      caro.forEach(r, function(extendName, i) {
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
    return caro.forEach(files, function(basename, i) {
      var dirPath, extendName, filePath, fileType, filename, fullDirPath, fullPath, oFileInfo;
      filename = self.getFileName(basename, false);
      extendName = self.getExtendName(basename);
      filePath = self.normalizePath(rootPath, basename);
      dirPath = self.getDirPath(filePath);
      fullPath = self.coverToFullPath(filePath);
      fullDirPath = self.getDirPath(fullPath);
      fileType = self.getFileType(filePath);
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
      if (self.isDir(filePath)) {
        if (getDir && pushFile(oFileInfo) === false) {
          return false;
        }
        readDir(filePath, layer);
        return;
      }
      if (self.isFile(filePath) && getFile && pushFile(oFileInfo) === false) {
        return false;
      }
    });
  };
  readDir(path, countLayer);
  return null;
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
    caro.forEach(aPath, function(eachDir) {
      var e, exists;
      subPath = self.normalizePath(subPath, eachDir);
      exists = self.exists(subPath);
      if (exists) {
        return;
      }
      try {
        return nFs.mkdirSync(subPath);
      } catch (_error) {
        e = _error;
        showErr(e);
        pass = false;
        return err.push(e);
      }
    });
    return err;
  };
  caro.forEach(aPath, function(dirPath) {
    err = [];
    err = createDir(dirPath);
    err = coverToFalseIfEmptyArr(err);
    return caro.executeIfFn(cb, err, dirPath);
  });
  return pass;
};
