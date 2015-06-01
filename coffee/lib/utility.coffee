###*
# Utility
###
###*
# get file stat
# @param {string} path
# @param {string} [type=l] s = statSync, l = lstatSync, f = fstatSync
# @returns {*}
###
self.getStat = (path, type = 'l') ->
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

###*
# check file if exists, return false when anyone is false
# @param {...string} path
# @param {function} [cb] the callback-function for each path
# @returns {*}
###
self.exists = (path, cb) ->
  allPass = true
  args = caro.classify(arguments)
  aPath = args.str
  cb = args.fn[0]
  caro.forEach(aPath, (path) ->
    pass = true
    err = false
    try
      if !nFs.existsSync(path)
        allPass = false
        pass = false
    catch e
      showErr(e)
      allPass = false
      pass = false
      err = e
    caro.executeIfFn(cb, err, path, pass)
  )
  return allPass

###*
# check if folder, return false when anyone is false
# @param {...string} path
# @param {function} [cb] the callback-function for each path
# @returns {*}
###
self.isDir = (path, cb) ->
  allPass = true
  args = caro.classify(arguments)
  aPath = args.str
  cb = args.fn[0]
  caro.forEach(aPath, (path) ->
    pass = true
    err = false
    try
      stat = self.getStat(path)
    catch e
      showErr(e)
      allPass = false
      pass = false
      err = e
    if !stat or !stat.isDirectory()
      allPass = false
      pass = false
    caro.executeIfFn(cb, err, path, pass)
  )
  return allPass

###*
# check if file, return false when anyone is false
# @param {...string} path
# @param {function} [cb] the callback-function for each path
# @returns {*}
###
self.isFile = (path) ->
  allPass = true
  args = caro.classify(arguments)
  aPath = args.str
  cb = args.fn[0]
  caro.forEach(aPath, (path) ->
    pass = true
    err = false
    try
      stat = self.getStat(path)
    catch e
      showErr(e)
      allPass = false
      pass = false
      err = e
    if !stat or !stat.isFile()
      allPass = false
      pass = false
    caro.executeIfFn(cb, err, path, pass)
  )
  return allPass

###*
# check if symbolic link, return false when anyone is false
# @param {function} [cb] the callback-function for each path
# @param {...string} path
# @returns {*}
###
self.isSymlink = (path) ->
  allPass = true
  args = caro.classify(arguments)
  aPath = args.str
  cb = args.fn[0]
  caro.forEach(aPath, (path) ->
    pass = true
    err = false
    try
      stat = self.getStat(path)
    catch e
      showErr(e)
      allPass = false
      pass = false
      err = e
    if !stat or !stat.isSymbolicLink()
      allPass = false
      pass = false
    caro.executeIfFn(cb, err, path, pass)
  )
  return allPass

###*
# @param {string} path
# @returns {string}
###
self.getFileType = (path) ->
  r = ''
  if self.isDir(path)
    r = 'dir'
  else if self.isFile(path)
    r = 'file'
  else if self.isSymlink(path)
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
  args = caro.classify(arguments)
  aPath = args.str
  cb = args.fn[0]
  force = args.bool[0] or false
  tryAndCatchErr = (fn)->
    try
      fn()
    catch e
      showErr(e)
      pass = false
      err.push e
  deleteFileOrDir = (path) ->
    if self.isFile(path)
      tryAndCatchErr(->
        nFs.unlinkSync(path)
      )
      return
    if self.isDir(path) and force
      tryAndCatchErr(->
        files = nFs.readdirSync(path)
        caro.forEach(files, (file) ->
          subPath = self.normalizePath(path, file)
          deleteFileOrDir(subPath)
        )
      )
    tryAndCatchErr(->
      nFs.rmdirSync(path)
    )
  caro.forEach(aPath, (eachPath) ->
    err = [] # reset err in each path
    deleteFileOrDir(eachPath)
    err = coverToFalseIfEmptyArr(err)
    caro.executeIfFn(cb, err, eachPath)
  )
  return pass

###*
# @param {string|...[]} path the file-path, you can also set as [path,newPath]
# @param {string|...[]} newPath the new-path, you can also set as [path,newPath]
# @param {function} [cb] the callback-function for each path
# @param {boolean} [force=false] will create folder if there is no path for newPath
# @returns {boolean}
###
self.renameFs = (path, newPath, cb, force) ->
  pass = true
  aPathMap = []
  args = caro.classify(arguments)
  cb = args.fn[0]
  force = args.bool[0] or false
  aPathMap = do ->
    if caro.isString(path) and caro.isString(newPath)
      return [[
                path
                newPath
              ]]
    args.arr
  # e.g. aPath=[[path, path2],[path3, path4]]
  caro.forEach(aPathMap, (pathMap) ->
    err = false
    path1 = pathMap[0]
    path2 = pathMap[1]
    try
      if force and self.exists(path1)
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