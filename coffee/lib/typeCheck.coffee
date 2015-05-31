###*
# TypeCheck
###
###*
# check if folder, return false when anyone is false
# @param {...string} path
# @param {function} [cb] the callback-function for each path
# @returns {*}
###
self.isDir = (path, cb) ->
  allPass = true
  args = getArgs(arguments)
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
  allPass

###*
# check if file, return false when anyone is false
# @param {...string} path
# @param {function} [cb] the callback-function for each path
# @returns {*}
###
self.isFile = (path) ->
  allPass = true
  args = getArgs(arguments)
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
  args = getArgs(arguments)
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
  allPass

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