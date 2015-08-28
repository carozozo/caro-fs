do ->
describe 'Utility', ->
  it 'setFsTrace', ->
    r = cf.setFsTrace(false)
    r.should.be.boolean

  it 'getStat', ->
    r = cf.getStat('./caro-fs.js')
    r.should.be.a('object')

  it 'exists', ->
    r = cf.exists('./caro-fs.js', 'c', (e, path, pass) ->
      e.should.be.false
      path = path == './caro-fs.js' or path == 'c'
      path.should.be.true
      pass.should.be.boolean
    )
    r.should.be.boolean

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

  it 'deleteFs', ->
    (createTestFile = ()->
      cf.createDir('1/2')
      cf.writeFile('test.js', 'test')
    )()
    r = cf.deleteFs('1', 'test.js', (e, path) ->
      path = path == '1' or path == 'test.js'
      e.should.be.failse
      path.should.be.true
    , true)
    r2 = cf.deleteFs('./aaa', './js', (e, path) ->
      e.should.be.a('array')
      path = path == './aaa' or path == './js'
      path.should.be.true
    )
    r.should.be.true
    r2.should.be.false

  it 'renameFs', ->
    (createTestFile = ()->
      cf.createDir('./1/2')
      cf.deleteFs('3', true)
    )()
    r = cf.renameFs('./1/2', '3/4', (e, path1, path2) ->
      e.should.be.false
      path1.should.eq('./1/2')
      path2.should.eq('3/4')
    , true)
    r2 = cf.renameFs(
      ['a', 'b/c'],
      ['2.js', 'd/2.js'],
      (e, path1, path2) ->
        e.should.not.be.false
        path1 = path1 == 'a' or path1 == '2.js'
        path2 = path2 == 'b/c' or path2 == 'd/2.js'
        path1.should.be.true
        path2.should.be.true
    )
    r3 = cf.deleteFs('1', '3', true)
    r.should.be.true
    r2.should.be.false
    r3.should.be.true