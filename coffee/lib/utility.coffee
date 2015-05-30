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
  caro.each aPath, (i, path) ->
    err = false
    try
      pass = false if !nFs.existsSync(path)
    catch e
      showErr(e)
      pass = false
      err = e
    caro.executeIfFn(cb, err, path)
    return
  pass

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
  caro.each aPath, (i, path) ->
    err = false
    try
      stat = caro.getFsStat(path)
      pass and pass = stat.isDirectory()
    catch e
      showErr(e)
      pass = false
      err = e
    caro.executeIfFn(cb, err, path)
    return
  pass

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
  caro.each aPath, (i, path) ->
    err = false
    try
      stat = caro.getFsStat(path)
      pass and pass = stat.isFile()
    catch e
      showErr(e)
      pass = false
      err = e
    caro.executeIfFn(cb, err, path)
    return
  pass

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
  caro.each aPath, (i, path) ->
    err = false
    try
      stat = caro.getFsStat(path)
      pass and pass = stat.isSymbolicLink()
    catch e
      showErr(e)
      pass = false
      err = e
    caro.executeIfFn(cb, err, path)
    return
  pass

###*
# @param {string} path
# @returns {string}
###
self.getFileType = (path) ->
  r = ''
  if caro.isFsDir(path)
    r = 'dir'
  if caro.isFsFile(path)
    r = 'file'
  if caro.isFsSymlink(path)
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
    return
  deleteFileOrDir = (path) ->
    if caro.isFsFile(path) and force
      tryAndCatchErr(->
        nFs.unlinkSync(path)
      )
      return
    if caro.isFsDir(path)
      tryAndCatchErr(->
        files = nFs.readdirSync(path)
        caro.each files, (i, file) ->
          subPath = caro.normalizePath(path, file)
          deleteFileOrDir(subPath)
          return
        return
      )
    tryAndCatchErr(->
      nFs.rmdirSync(path)
    )
    err
  caro.each aPath, (i, dirPath) ->
    err = [] # reset err in each path
    err = deleteFileOrDir(dirPath)
    err = coverToFalseIfEmptyArr(err)
    caro.executeIfFn(cb, err, dirPath)
  pass

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
  caro.each aPathMap, (i, pathMap) ->
    err = false
    path1 = pathMap[0]
    path2 = pathMap[1]
    try
      if force and caro.fsExists(path1)
        dirPath2 = caro.getDirPath(path2)
        caro.createDir dirPath2
      nFs.renameSync path1, path2
    catch e
      showErr(e)
      pass = false
      err = e
    caro.executeIfFn(cb, err, path1, path2)
    return
  pass

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
  stat

###*
# get file size, default in bytes or set by unit
# @param {number|string} path file-path or bytes
# @param {number} [fixed=1] decimals of float
# @param {string} [unit] the file-size unit
# @returns {}
###
self.getFsSize = (path, fixed = 1, unit) ->
  bytes = getFileSize(path)
  return bytes if bytes == null
  args = caro.objToArr(arguments)
  args.shift()
  args = getArgs(args)
  fixed = caro.coverToInt(args.num[0])
  fixed = if fixed > -1 then fixed else 1
  unit = args.str[0]
  si = true
  unit = caro.upperFirst(unit) # e.g. 'mib' -> 'Mib'
  unit = caro.upperStr(unit, {start: -1}) # e.g. 'Mib' -> 'MiB'
  index1 = fileSizeUnits1.indexOf(unit)
  index2 = fileSizeUnits2.indexOf(unit)
  si = false if index2 > -1
  index = if si then index1 else index2
  return bytes if index < 0
  count = 0
  thresh = if si then 1000 else 1024
  while count < index
    bytes /= thresh
    ++count
  caro.coverToNum(bytes.toFixed(fixed))

###*
# get file size for human-reading
# @param {number|string} path file-path or bytes
# @param {number} [fixed=1] decimals of float
# @param {boolean} [si=true] size-type, true decimal, false as binary
# @returns {string}
###
self.humanFeSize = (path, fixed = 1, si = true) ->
  bytes = getFileSize(path)
  return bytes if bytes == null
  thresh = if si then 1000 else 1024
  return bytes + ' B' if bytes < thresh
  aUnit = if si then fileSizeUnits1 else fileSizeUnits2
  u = -1
  while bytes >= thresh
    bytes /= thresh
    ++u
  caro.coverToFixed(bytes, fixed) + ' ' + aUnit[u]