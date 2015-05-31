###*
# FileSystem
###
fileSizeUnits1 = [
  'KB'
  'MB'
  'GB'
  'TB'
  'PB'
  'EB'
  'ZB'
  'YB'
]
fileSizeUnits2 = [
  'KiB'
  'MiB'
  'GiB'
  'TiB'
  'PiB'
  'EiB'
  'ZiB'
  'YiB'
]

###*
# check file if exists, return false when anyone is false
# @param {...string} path
# @param {function} [cb] the callback-function for each path
# @returns {*}
###
self.fsExists = (path, cb) ->
  pass = true
  args = getArgs(arguments)
  aPath = args.str
  cb = args.fn[0]
  caro.forEach(aPath, (path) ->
    err = false
    try
      pass = false if !nFs.existsSync(path)
    catch e
      showErr(e)
      pass = false
      err = e
    caro.executeIfFn(cb, err, path)
  )
  return pass

###*
# check if folder, return false when anyone is false
# @param {...string} path
# @param {function} [cb] the callback-function for each path
# @returns {*}
###
self.isFsDir = (path, cb) ->
  pass = true
  args = getArgs(arguments)
  aPath = args.str
  cb = args.fn[0]
  caro.forEach(aPath, (path) ->
    err = false
    try
      stat = self.getFsStat(path)
      pass and pass = stat.isDirectory()
    catch e
      showErr(e)
      pass = false
      err = e
    caro.executeIfFn(cb, err, path)
  )
  return pass

###*
# check if file, return false when anyone is false
# @param {...string} path
# @param {function} [cb] the callback-function for each path
# @returns {*}
###
self.isFsFile = (path) ->
  pass = true
  args = getArgs(arguments)
  aPath = args.str
  cb = args.fn[0]
  caro.forEach(aPath, (path) ->
    err = false
    try
      stat = self.getFsStat(path)
      pass and pass = stat.isFile()
    catch e
      showErr(e)
      pass = false
      err = e
    caro.executeIfFn(cb, err, path)
  )
  return pass

###*
# check if symbolic link, return false when anyone is false
# @param {function} [cb] the callback-function for each path
# @param {...string} path
# @returns {*}
###
self.isFsSymlink = (path) ->
  pass = true
  args = getArgs(arguments)
  aPath = args.str
  cb = args.fn[0]
  caro.forEach(aPath, (path) ->
    err = false
    try
      stat = self.getFsStat(path)
      pass and pass = stat.isSymbolicLink()
    catch e
      showErr(e)
      pass = false
      err = e
    caro.executeIfFn(cb, err, path)
  )
  return pass

###*
# @param {string} path
# @returns {string}
###
self.getFileType = (path) ->
  r = ''
  if self.isFsDir(path)
    r = 'dir'
  if self.isFsFile(path)
    r = 'file'
  if self.isFsSymlink(path)
    r = 'link'
  r

###*
# delete file/folder recursively
# @param {...string} path
# @param {function} [cb] the callback-function for each path
# @param {boolean} [force=false] force-delete even not empty
# @returns {boolean}
###
self.deleteFs = (path, cb, force) ->
  err = []
  pass = true
  args = getArgs(arguments)
  aPath = args.str
  cb = args.fn[0]
  force = args.bool[0]
  tryAndCatchErr = (fn)->
    try
      fn()
    catch e
      showErr(e)
      pass = false
      err.push e
  deleteFileOrDir = (path) ->
    if self.isFsFile(path) and force
      tryAndCatchErr(->
        nFs.unlinkSync(path)
      )
      return
    if self.isFsDir(path)
      tryAndCatchErr(->
        files = nFs.readdirSync(path)
        caro.forEach(files, (file) ->
          subPath = caro.normalizePath(path, file)
          deleteFileOrDir(subPath)
        )
      )
    tryAndCatchErr(->
      nFs.rmdirSync(path)
    )
    return err
  caro.forEach(aPath, (dirPath) ->
    err = [] # reset err in each path
    err = deleteFileOrDir(dirPath)
    err = coverToFalseIfEmptyArr(err)
    caro.executeIfFn(cb, err, dirPath)
  )
  return pass

###*
# @param {string|...[]} path the file-path, you can also set as [path,newPath]
# @param {string|...[]} newPath the new-path, you can also set as [path,newPath]
# @param {function} [cb] the callback-function for each path
# @param {boolean} [force=false] will create folder if there is no path for newPath
# @returns {boolean}
###
self.renameFs = (path, newPath, cb, force = false) ->
  pass = true
  aPathMap = []
  args = getArgs(arguments)
  cb = args.fn[0]
  force = args.bool[0]
  aPathMap = do ->
    if caro.isString(path) and caro.isString(newPath)
      return [
        path
        newPath
      ]
    args.arr
  # e.g. aPath=[[path, path2],[path3, path4]]
  caro.forEach(aPathMap, (pathMap) ->
    err = false
    path1 = pathMap[0]
    path2 = pathMap[1]
    try
      if force and self.fsExists(path1)
        dirPath2 = self.getDirPath(path2)
        self.createDir dirPath2
      nFs.renameSync path1, path2
    catch e
      showErr(e)
      pass = false
      err = e
    caro.executeIfFn(cb, err, path1, path2)
  )
  return pass

###*
# get file stat
# @param {string} path
# @param {string} [type=l] s = statSync, l = lstatSync, f = fstatSync
# @returns {*}
###
self.getFsStat = (path, type = 'l') ->
  stat = null
  aType = [
    'l'
    's'
    'f'
  ]
  type = if aType.indexOf(type) > -1 then type else aType[0]
  try
    switch type
      when 's'
        stat = nFs.lstatSync(path)
      when 'f'
        stat = nFs.fstatSync(path)
      else
        stat = nFs.statSync(path)
        break
  catch e
    showErr(e)
  return stat