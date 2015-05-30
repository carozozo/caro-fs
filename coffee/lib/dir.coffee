###*
# Dir
###
getArgs = (args) ->
  aStr = []
  aFn = []
  aBool = []
  aArr = []
  aNum = []
  caro.each args, (i, arg) ->
    if caro.isFunction(arg)
      aFn.push arg
      return
    if caro.isBoolean(arg)
      aBool.push arg
      return
    if caro.isString(arg)
      aStr.push arg
      return
    if caro.isArray(arg)
      aArr.push arg
      return
    if caro.isNumber(arg)
      aNum.push arg
      return
    return
  fn: aFn
  bool: aBool
  str: aStr
  arr: aArr
  num: aNum
coverToFalseIfEmptyArr = (arr) ->
  return false if arr.length < 1
  arr

###*
# check if empty-folder, return false if anyone is false
# @param {...string} path
# @param {function} [cb] the callback-function for each path
# @returns {boolean}
###
self.isEmptyDir = (path, cb) ->
  pass = true
  args = getArgs(arguments)
  aPath = args.str
  cb = args.fn[0]
  caro.each aPath, (i, path) ->
    try
      count = nFs.readdirSync(path)
      pass = false if count.length > 0
      caro.executeIfFn(cb, false, path)
    catch e
      showErr(e)
      pass = false
      caro.executeIfFn(cb, e, path)
    return
  pass

###*
# get files under path
# @param {string} path
# @param {function(object)} [cb] cb with file-info
# @param {object} [opt]
# @param {number} [opt.maxLayer=1] the dir-layer you want to read, get all-layer when 0
# @param {boolean} [opt.getDir=true] if return dir-path
# @param {boolean} [opt.getFile=true] if return file-path
# @param {boolean|string|[]} [opt.getByExtend=false] if set as string, will only return files including same extend-name
# @returns {*}
###
self.readDirCb = (path, cb, opt = {}) ->
  countLayer = 0
  maxLayer = if opt.maxLayer? then parseInt(opt.maxLayer, 10) else 1
  getDir = opt.getDir != false
  getFile = opt.getFile != false
  getByExtend = do ->
    r = false
    if opt.getByExtend
      r = caro.splitStr(opt.getByExtend, ',')
      caro.each r, (i, extendName) ->
        r[i] = caro.addHead(extendName, '.')
        return
    r
  pushFile = (oFileInfo) ->
    extendName = oFileInfo.extendName
    return if getByExtend and getByExtend.indexOf(extendName) < 0
    cb false, oFileInfo
  readDir = (rootPath, layer) ->
    if maxLayer > 0 and layer >= maxLayer
      return
    try
      files = nFs.readdirSync(rootPath)
    catch e
      showErr(e)
      cb e
    layer++
    caro.each files, (i, basename) ->
      filename = caro.getFileName(basename, false)
      extendName = caro.getExtendName(basename)
      filePath = caro.normalizePath(rootPath, basename)
      dirPath = caro.getDirPath(filePath)
      fullPath = caro.coverToFullPath(filePath)
      fullDirPath = caro.getDirPath(fullPath)
      fileType = caro.getFileType(filePath)
      oFileInfo =
        filename: filename
        extendName: extendName
        basename: basename
        filePath: filePath
        dirPath: dirPath
        fullPath: fullPath
        fullDirPath: fullDirPath
        fileType: fileType
        layer: layer - 1
        index: i
      if caro.isFsDir(filePath)
        return false if getDir and pushFile(oFileInfo) == false
        readDir filePath, layer
        return
      return false if caro.isFsFile(filePath) and getFile and pushFile(oFileInfo) == false
      return
    return
  readDir path, countLayer
  return

###*
# create dir recursively, will create folder if path not exists
# @param {...string} path
# @param {function} [cb] the callback-function for each path
# @returns {*|string}
###
self.createDir = (path, cb) ->
  err = []
  pass = true
  args = getArgs(arguments)
  aPath = args.str
  cb = args.fn[0]
  createDir = (dirPath)->
    subPath = ''
    aPath = caro.splitStr(dirPath, [
      '\\' # for windows
      '/' # for linux
    ])
    caro.each aPath, (i, eachDir)->
      subPath = caro.normalizePath(subPath, eachDir)
      exists = caro.fsExists(subPath)
      return if exists
      try
        nFs.mkdirSync subPath
      catch e
        showErr(e)
        pass = false
        err.push e
      return
    err
  caro.each aPath, (i, dirPath) ->
    err = [] # reset err in each path
    err = createDir(dirPath)
    err = coverToFalseIfEmptyArr(err)
    caro.executeIfFn(cb, err, dirPath)
  pass