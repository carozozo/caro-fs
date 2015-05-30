###*
# Dir
###
coverToFalseIfEmptyArr = (arr) ->
  return false if arr.length < 1
  return arr

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
  caro.forEach(aPath, (path) ->
    try
      count = nFs.readdirSync(path)
      pass = false if count.length > 0
      caro.executeIfFn(cb, false, path)
    catch e
      showErr(e)
      pass = false
      caro.executeIfFn(cb, e, path)
  )
  return pass

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
self.readDir = (path, cb, opt = {}) ->
  countLayer = 0
  maxLayer = if opt.maxLayer? then parseInt(opt.maxLayer, 10) else 1
  getDir = opt.getDir != false
  getFile = opt.getFile != false
  getByExtend = do ->
    r = false
    if opt.getByExtend
      r = caro.splitStr(opt.getByExtend, ',')
      caro.forEach(r, (extendName, i) ->
        r[i] = caro.addHead(extendName, '.')
        return
      )
    return r
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
    caro.forEach(files, (basename, i) ->
      filename = self.getFileName(basename, false)
      extendName = self.getExtendName(basename)
      filePath = self.normalizePath(rootPath, basename)
      dirPath = self.getDirPath(filePath)
      fullPath = self.coverToFullPath(filePath)
      fullDirPath = self.getDirPath(fullPath)
      fileType = self.getFileType(filePath)
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
      if self.isFsDir(filePath)
        return false if getDir and pushFile(oFileInfo) == false
        readDir filePath, layer
        return
      return false if self.isFsFile(filePath) and getFile and pushFile(oFileInfo) == false
    )
  readDir path, countLayer
  return null

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
  createDir = (dirPath) ->
    subPath = ''
    aPath = caro.splitStr(dirPath, [
      '\\' # for windows
      '/' # for linux
    ])
    caro.forEach(aPath, (eachDir)->
      subPath = self.normalizePath(subPath, eachDir)
      exists = self.fsExists(subPath)
      return if exists
      try
        nFs.mkdirSync subPath
      catch e
        showErr(e)
        pass = false
        err.push e
    )
    return err
  caro.forEach(aPath, (dirPath) ->
    err = [] # reset err in each path
    err = createDir(dirPath)
    err = coverToFalseIfEmptyArr(err)
    caro.executeIfFn(cb, err, dirPath)
  )
  return pass