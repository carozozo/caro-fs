###*
# Caro-FS
# @author Caro.Huang
###
self = {}
traceMode = false
nFs = require('fs')
nPath = require('path')
caro = require('caro')
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
getArgs = (args) ->
  aStr = []
  aFn = []
  aBool = []
  aArr = []
  aNum = []
  aObj = []
  caro.forEach(args, (arg) ->
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
    if caro.isPlainObject(arg)
      aObj.push(arg)
  )
  fn: aFn
  bool: aBool
  str: aStr
  arr: aArr
  num: aNum
  obj: aObj
showErr = (e) ->
  console.error(e) if traceMode
getFileSize = (path) ->
  return path if caro.isNumber(path)
  status = self.getStat(path)
  return status.size if status
  return null

###*
# set trace-mode, will console.error when got exception
# @returns {boolean} [bool=false]
###
self.setFsTrace = (bool) ->
  traceMode = bool == true

module.exports = self