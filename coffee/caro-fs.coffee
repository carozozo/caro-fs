###*
# Caro-FS
# @author Caro.Huang
###
self = {}
traceMode = false
nFs = require('fs')
nPath = require('path')
caro = require('caro')
getArgs = (args) ->
  aStr = []
  aFn = []
  aBool = []
  aArr = []
  aNum = []
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
  )
  fn: aFn
  bool: aBool
  str: aStr
  arr: aArr
  num: aNum
showErr = (e) ->
  console.error(e) if traceMode

###*
# set trace-mode, will console.error when got exception
# @returns {boolean}
###
self.setFsTrace = (bool) ->
  traceMode = bool == true

module.exports = self