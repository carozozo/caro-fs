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