###*
# File
###

###*
# read file content, return false if failed
# @param {string} path
# @param {function} [cb] the callback function that passing error and data
# @param {object} [opt]
# @param {string} [opt.encoding=utf8]
# @param {string} [opt.flag=null]
# @returns {*}
###
self.readFile = (path, opt, cb) ->
  data = false
  err = false
  args = getArgs(arguments);
  opt = args.obj[0] or {}
  cb = args.fn[0] or null
  encoding = opt.encoding or 'utf8'
  flag = opt.flag or flag
  try
    data = nFs.readFileSync(path,
      encoding: encoding
      flag: flag
    )
  catch e
    showErr(e)
    err = e
  caro.executeIfFn(cb, err, data)
  data

###*
# write data to file, return false if failed
# @param {string} path
# @param {*} data
# @param {string} [encoding=utf8]
# @param {string} [flag=null]
# @returns {*}
###
self.writeFile = (path, data, encoding = 'utf8', flag = null) ->
  try
    nFs.writeFileSync path, data,
      encoding: encoding
      flag: flag
    return true
  catch e
    showErr(e)
  false

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
  args = caro.drop(arguments)
  args = getArgs(args)
  fixed = caro.toInteger(args.num[0])
  fixed = if fixed > -1 then fixed else 1
  unit = args.str[0]
  si = true
  unit = caro.capitalize(unit) # e.g. 'mib' -> 'Mib'
  unit = caro.upperStr(unit, -1) # e.g. 'Mib' -> 'MiB'
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
  caro.toNumber(caro.toFixedNumber(bytes, fixed))

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
  caro.toFixedNumber(bytes, fixed) + ' ' + aUnit[u]