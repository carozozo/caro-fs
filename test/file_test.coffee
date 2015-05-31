do ->
describe 'File', ->
  it 'readFile', ->
    r = cf.readFile(__dirname + '/file_test2.coffee', (e)->
      e.should.be.a('object')
    );
    r.should.be.false
    r2 = cf.readFile(__dirname + '/file_test.coffee', (e)->
      e.should.be.false
    );
    r2.should.be.a('string')

  it 'writeFile', ->
    r = cf.writeFile(__dirname + '/\/file_test2.coffee', '123');
    cf.deleteFs(__dirname + '/\/file_test2.coffee');
    r.should.be.a('boolean')

  it 'getFsSize', ->
    r = cf.getFsSize('./caro-fs.js');
    r2 = cf.getFsSize('./fileNotExists.js', 'mb');
    r3 = cf.getFsSize(123000.00, 5, 'gib');
    r.should.be.a('number')
    should.equal(r2, null)
    r3.should.be.eq(0.1173)

  it 'humanFeSize', ->
    r = cf.humanFeSize('./caro-fs.js', 3);
    r2 = cf.humanFeSize('./fileNotExists.js', 3);
    r3 = cf.humanFeSize(10000000, 2, false);
    r.should.be.a('string')
    should.equal(r2, null)
    r3.should.be.eq('9.54 MiB')