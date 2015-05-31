do ->
describe.only 'Utility', ->
  it 'setFsTrace', ->
    r = cf.setFsTrace(false);
    r.should.be.boolean

  #  it 'getStat', ->
  #    r = cf.getStat('./cf.js');
  #    r.should.be.a('object')

  it 'exists', ->
    r = cf.exists('./caro-fs.js', 'c', (e, path, pass) ->
      e.should.be.false
      path = path == './caro-fs.js' or path == 'c'
      path.should.be.true
      pass.should.be.boolean
    );
    r.should.be.boolean

  it 'isDir', ->
    r = cf.isDir('./caro-fs.js', './js', (e, path, pass) ->
      e.should.be.false
      path = path == './caro-fs.js' or path == './js'
      path.should.be.true
      pass.should.be.boolean
    );
    r.should.be.a('boolean')

  it 'isFile', ->
    r = cf.isFile('./caro-fs.js', './js', (e, path, pass) ->
      e.should.be.false
      path = path == './caro-fs.js' or path == './js'
      path.should.be.true
      pass.should.be.boolean
    );
    r.should.be.a('boolean')

  it 'isSymlink', ->
    r = cf.isSymlink('./caro-fs.js', './js', (e, path, pass) ->
      e.should.be.false
      path = path == './caro-fs.js' or path == './js'
      path.should.be.true
      pass.should.be.boolean
    );
    r.should.be.a('boolean')

  it 'getFileType', ->
    r = cf.getFileType('./cf');
    r2 = cf.getFileType('./caro-fs.js');
    r.should.eq ''
    r2.should.eq 'file'

  it 'deleteFs', ->
    (createTestFile = ()->
      cf.createDir('1/2')
      data = cf.readFile('caro-fs.js')
      cf.writeFile('caro-fs2.js', data)
    )();
    r = cf.deleteFs('1', 'caro-fs2.js', (e, path) ->
      path = path == '1' or path == 'caro-fs2.js'
      e.should.be.failse
      path.should.be.true
    , true);
    r2 = cf.deleteFs('./aaa','./js', (e, path) ->
      e.should.be.a('array')
      path = path == './aaa' or path == './js'
      path.should.be.true
    );
    r.should.be.true
    r2.should.be.false
#
#  it 'renameFs', ->
#    r = cf.renameFs('./a', './b/c', true);
#    r2 = cf.renameFs(
#      ['a', 'b/c'],
#      ['2.js', 'd/2.js'],
#      (e, path1, path2) ->
#    , true
#    );
#    r.should.be.a('boolean')
#    r2.should.be.a('boolean')