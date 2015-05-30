#do ->
#describe 'Dir', ->
#  it 'isEmptyDir', ->
#    r = cf.isEmptyDir(__dirname + '/1', __dirname + '/2',
#      (e) ->
#    );
#    r.should.be.a('boolean')
#
#  it 'readDirCb', ->
#    cf.readDirCb('js',
#      (err, oFileInfo) ->
#        console.log oFileInfo.filename
#    , {
#        maxLayer: 1
#        getDir: true
#        getFile: true
#        getByExtend: false
#      });
#
#  it 'createDir', ->
#    r = cf.createDir('1/a', '2',
#      (e, path) ->
#    );
#    r.should.be.a('boolean')