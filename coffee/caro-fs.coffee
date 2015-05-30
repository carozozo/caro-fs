###*
# Caro-FS
# @author Caro.Huang
###
self = {}
traceMode = false
nFs = require('fs')
nPath = require('path')
caro = require('caro')

showErr = (e) ->
  console.error(e) if traceMode

###*
# set trace-mode, will console.error when got exception
# @returns {boolean}
###
self.setFsTrace = (bool) ->
  traceMode = bool == true

module.exports = self