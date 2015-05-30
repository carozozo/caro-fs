do ->
describe 'FileSystem', ->
  it 'fsExists', ->
    r = cf.fsExists('./a/b', 'c', (e, path) ->
    );
    r.should.be.a('boolean')

  it 'isFsDir', ->
    r = cf.isFsDir('./a', 'c', (e, path) ->
    );
    r.should.be.a('boolean')

  it 'isFsFile', ->
    r = cf.isFsFile('./caro', (e, path) ->
    );
    r.should.be.a('boolean')

  it 'isFsSymlink', ->
    r = cf.isFsSymlink('./cf', (e, path) ->
    );
    r.should.be.a('boolean')

  it 'getFileType', ->
    r = cf.getFileType('./cf');
    r2 = cf.getFileType('./cf.js');
    r.should.eq ''
    r2.should.eq 'file'

  it 'deleteFs', ->
    r = cf.deleteFs('1', '2')
    r = cf.deleteFs('./src', './1.js', './2.lnk',
      (e, path) ->
    , true);
    r.should.be.a('boolean')

  it 'renameFs', ->
    r = cf.renameFs('./a', './b/c', true);
    r2 = cf.renameFs(
      ['a', 'b/c'],
      ['2.js', 'd/2.js'],
      (e, path1, path2) ->
    , true
    );
    r.should.be.a('boolean')
    r2.should.be.a('boolean')

  it 'getFsStat', ->
    r = cf.getFsStat('./cf.js');
    r.should.be.a('object')

  it 'getFsSize', ->
    r = cf.getFsSize('./cf.js');
    r2 = cf.getFsSize('./cf.js', 'mb');
    r3 = cf.getFsSize(123000.00, 5, 'gib');
    r.should.be.a('number')
    r2.should.be.a('number')
    r3.should.be.a('number')

  it 'humanFeSize', ->
    r = cf.humanFeSize('./cf.js', 'ededed', undefined);
    r2 = cf.humanFeSize('./cf.js', 3);
    r3 = cf.humanFeSize(10000000, 2, false);
    r.should.be.a('string')
    r2.should.be.a('string')
    r3.should.be.eq('9.54 MiB')