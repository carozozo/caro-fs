do ->
describe 'Path', ->
  it.only 'setAbsolutePath', ->
    r = cf.setAbsolutePath('/path/from/root');
    r2 = cf.setAbsolutePath('/path2///from\\\\root');
    r3 = cf.setAbsolutePath({});
    r = r == '/path/from/root' || r == '\\path\\from\\root'
    r2 = r2 == '/path2/from\\\\root' || r2 == '\\path2\\from\\root'
    r.should.be.true
    r2.should.be.true
    r3.should.be.false

  it 'getAbsolutePath', ->
    cf.setAbsolutePath('/path/from/root');
    r = cf.getAbsolutePath();
    r = r == '/path/from/root' || r == '\\path\\from\\root'
    r.should.be.true

  it 'normalizePath', ->
    r = cf.normalizePath('path//seems/not/exists');
    r2 = cf.normalizePath('path', '\exists');
    r = r == 'path/seems/not/exists' || r == 'path\\seems\\not\\exists'
    r2 = r2 == 'path/exists' || r2 == 'path\\exists'
    r.should.be.true
    r2.should.be.true

  it 'isFullPath', ->
    cf.setAbsolutePath('/path/from/root');
    r = cf.isFullPath('/path/from/root/cf.js');
    r2 = cf.isFullPath('/path/from/root/cf.js', '/path2/from/root/cf.js');
    r.should.be.true
    r2.should.be.false

  it 'getDirPath', ->
    r = cf.getDirPath('/path/from/root');
    r2 = cf.getDirPath('/path/from/root/cf.js');
    r.should.eq '/path/from'
    r2.should.eq '/path/from/root'

  it 'getFileName', ->
    r = cf.getFileName('/path/from/root');
    r2 = cf.getFileName('/path/from/root/cf.js');
    r3 = cf.getFileName('/path/from/root/cf.js', false);
    r.should.eq 'root'
    r2.should.eq 'cf.js'
    r3.should.eq 'cf'

  it 'getExtendName', ->
    r = cf.getExtendName('cf.js');
    r2 = cf.getExtendName('cf.js.bk', false);
    r.should.eq '.js'
    r2.should.eq 'bk'

  it 'coverToFullPath', ->
    cf.setAbsolutePath('/path/from/root');
    r = cf.coverToFullPath('cf.js');
    r2 = cf.coverToFullPath('other', 'cf.js');
    r3 = cf.coverToFullPath('/path/from/root/cf.js');
    r = r == '/path/from/root/cf.js' || r == '\\path\\from\\root\\cf.js'
    r2 = r2 == '/path/from/root/other/cf.js' || r2 == '\\path\\from\\root\\other\\cf.js'
    r3 = r3 == '/path/from/root/cf.js' || r3 == '\\path\\from\\root\\cf.js'
    r.should.be.true
    r2.should.be.true
    r3.should.be.true