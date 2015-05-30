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