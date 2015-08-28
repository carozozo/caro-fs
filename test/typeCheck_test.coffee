do ->
describe 'TypeCheck', ->
  it 'isDir', ->
    r = cf.isDir('./caro-fs.js', './js', (e, path, pass) ->
      e.should.be.false
      path = path == './caro-fs.js' or path == './js'
      path.should.be.true
      pass.should.be.boolean
    )
    r.should.be.false

  it 'isFile', ->
    r = cf.isFile('./caro-fs.js', './js', (e, path, pass) ->
      e.should.be.false
      path = path == './caro-fs.js' or path == './js'
      path.should.be.true
      pass.should.be.boolean
    )
    r.should.be.false

  it 'isSymlink', ->
    r = cf.isSymlink('./notExist.js', './js', (e, path, pass) ->
      e.should.be.false
      path = path == './notExist.js' or path == './js'
      path.should.be.true
      pass.should.be.false
    )
    r.should.be.false

  it 'getFileType', ->
    r = cf.getFileType('./cf')
    r2 = cf.getFileType('./caro-fs.js')
    r.should.eq ''
    r2.should.eq 'file'