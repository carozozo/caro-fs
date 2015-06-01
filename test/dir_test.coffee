do ->
describe 'Dir', ->
  it 'isEmptyDir', ->
    r = cf.isEmptyDir('/1', '/2',
      (e, path) ->
        e.should.be.a('object')
        path = path == '/1' or path == '/2'
        path.should.be.true
    );
    r.should.be.false

  it 'readDir', ->
    cf.readDir('js',
      (e, oFileInfo) ->
        e.should.be.false
        oFileInfo.should.has.keys [
          'filename', 'extendName', 'basename', 'filePath', 'dirPath',
          'fullPath', 'fullDirPath', 'fileType', 'layer', 'index'
        ]
      maxLayer: 0
      getDir: true
      getFile: true
      getByExtend: false
    );

  it 'createDir', ->
    r = cf.createDir('1/a', '2',
      (e, path) ->
        path = path == '1/a' or path == '2'
        e.should.be.false
        path.should.be.true
    );
    r2 = cf.deleteFs('1', '2', true)
    r.should.be.true
    r2.should.be.true