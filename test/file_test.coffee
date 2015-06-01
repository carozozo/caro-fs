do ->
describe 'File', ->
  it 'readFile', ->
    r = cf.readFile(__dirname + '/file_test2.coffee', (e, data) ->
      e.should.be.a('object')
      should.equal(data, null)
    );
    should.equal(r, null)
    r2 = cf.readFile(__dirname + '/file_test.coffee', (e, data) ->
      e.should.be.false
      data.should.be.a('string')
    , {
        encoding: 'utf8'
      });
    r2.should.be.a('string')

  it 'writeFile', ->
    r = cf.writeFile('./test.coffee', '中文', (e) ->
      e.should.be.false
    );
    r2 = cf.deleteFs('./test.coffee');
    r.should.be.true
    r2.should.be.true

  it 'copyFile', ->
    r = cf.copyFile('caro-fs.js', 'test.js', (e) ->
      e.should.be.false
    );
    r2 = cf.deleteFs('test.js');
    r.should.be.true
    r2.should.be.true

    r2 = cf.copyFile('Penguins.jpg', 'test.jpg', (e) ->
      e.should.be.a('object')
    );
    r2.should.be.false

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