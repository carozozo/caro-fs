###*
# File
###

###*
# read file content, return false if failed
# @param {string} path
# @param {?string} [encoding=utf8]
# @param {?string} [flag=null]
# @returns {*}
###
self.readFileCaro = (path, encoding = 'utf8', flag = null) ->
  try
    return nFs.readFileSync(path,
      encoding: encoding
      flag: flag)
  catch e
    showErr(e)
  false

###*
# write data to file, return false if failed
# @param {string} path
# @param {*} data
# @param {?string} [encoding=utf8]
# @param {?string} [flag=null]
# @returns {*}
###
self.writeFileCaro = (path, data, encoding = 'utf8', flag = null) ->
  try
    nFs.writeFileSync path, data,
      encoding: encoding
      flag: flag
    return true
  catch e
    showErr(e)
  false
