#describe 'File', ->
#  cf = require('../caro-fs.js')
#
#  it 'setFsTrace', ->
#    r = cf.setFsTrace(false);
#    r.should.be.a('boolean')
#
#  it 'readFile', ->
#    r = cf.readFile(__dirname + '/path_test.coffee');
#    r.should.be.a('string')
#
#  it 'writeFile', ->
#    data = cf.readFile(__dirname + '/test.html');
#    r = cf.writeFile(__dirname + '/\/test2.html', data);
#    r.should.be.a('boolean')
#
#  it 'getFsSize', ->
#    r = cf.getFsSize('./cf.js');
#    r2 = cf.getFsSize('./cf.js', 'mb');
#    r3 = cf.getFsSize(123000.00, 5, 'gib');
#    r.should.be.a('number')
#    r2.should.be.a('number')
#    r3.should.be.a('number')
#
#  it 'humanFeSize', ->
#    r = cf.humanFeSize('./cf.js', 'ededed', undefined);
#    r2 = cf.humanFeSize('./cf.js', 3);
#    r3 = cf.humanFeSize(10000000, 2, false);
#    r.should.be.a('string')
#    r2.should.be.a('string')
#    r3.should.be.eq('9.54 MiB')