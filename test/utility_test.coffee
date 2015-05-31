#do ->
#describe.only 'Utility', ->
#  it 'setFsTrace', ->
#    r = cf.setFsTrace(false);
#    r.should.be.a('boolean')
#  it 'fsExists', ->
#    r = cf.fsExists('./a/b', 'c', (e, path) ->
#    );
#    r.should.be.a('boolean')
#
#  it 'isFsDir', ->
#    r = cf.isFsDir('./a', 'c', (e, path) ->
#    );
#    r.should.be.a('boolean')
#
#  it 'isFsFile', ->
#    r = cf.isFsFile('./caro', (e, path) ->
#    );
#    r.should.be.a('boolean')
#
#  it 'isFsSymlink', ->
#    r = cf.isFsSymlink('./cf', (e, path) ->
#    );
#    r.should.be.a('boolean')
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