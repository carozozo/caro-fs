do ->
describe 'File', ->
  cf = require('../caro-fs.js')

  it 'setFsTrace', ->
    r = cf.setFsTrace(false);
    r.should.be.a('boolean')

  it.only 'readFileCaro', ->
    r = cf.readFileCaro(__dirname + '/path_test.coffee');
    r.should.be.a('string')

  it 'writeFileCaro', ->
    data = cf.readFileCaro(__dirname + '/test.html');
    r = cf.writeFileCaro(__dirname + '/\/test2.html', data);
    r.should.be.a('boolean')