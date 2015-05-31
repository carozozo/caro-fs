do ->
describe.only 'Utility', ->
  it 'setFsTrace', ->
    r = cf.setFsTrace(false);
    r.should.be.boolean

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
#
#  it 'getFileType', ->
#    r = cf.getFileType('./cf');
#    r2 = cf.getFileType('./cf.js');
#    r.should.eq ''
#    r2.should.eq 'file'
#
#  it 'deleteFs', ->
#    r = cf.deleteFs('1', '2')
#    r = cf.deleteFs('./src', './1.js', './2.lnk',
#      (e, path) ->
#    , true);
#    r.should.be.a('boolean')
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
#
#  it 'getFsStat', ->
#    r = cf.getFsStat('./cf.js');
#    r.should.be.a('object')