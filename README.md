# Caro-FS
[![Build Status](https://travis-ci.org/carozozo/caro-fs.svg?branch=master)](https://travis-ci.org/carozozo/caro-fs)

The FileSystem Operator

## Install and Usage
```bash
$ npm install caro-fs
```

```javascript
var cf = require('caro-fs');
cf.exists(['caro-fs.js']); // boolean
```

## Index
**[Dir](#dir)** | **[File](#file)** | **[Path](#path)** | **[TypeCheck](#typecheck)** | **[Utility](#utility)** 

### Dir
[Back to Index](#index)
- **isEmptyDir(path... [cb]) - check if empty folder**
```javascript
var r = cf.isEmptyDir('/1'); // boolean
var r2 = cf.isEmptyDir('/1', '/2', function (err, path){
    // catch error and path
}); // boolean
```
- **readDirCb(path, cb [opt]) - get file-info under dir**
```javascript
cf.readDirCb('../src', function(err, oFileInfo) {
    // you can stop callback by return false
    console.log(oFileInfo); 
    console.log(oFileInfo.filename);
    // filename
    // extendName
    // basename
    // filePath
    // dirPath
    // fullPAth
    // fullDirPath
    // fileType
    // layer
    // index
 }, {
    maxLayer: 1, // the layer you want to get, will get all if 0
    getDir: true, // if get dir
    getFile: true, // if get file
    getByExtend: false // e.g. 'js,html' => only get .js and .html files
}); // - here is default options
```
- **createDir(path... [cb]) - create folder**
```javascript
var r = cf.createDir('./src/lib/coffee'); // boolean (will try to create /src/lib, /src/lib/coffee)
var r2 = cf.createDir('./\/test','test2/sub_test', function (err, path){
    // catch error and path
}); // boolean
```

### File
[Back to Index](#index)
- **readFile(path [cb] [opt]) - read file content**
```javascript
// https://nodejs.org/api/fs.html#fs_fs_readfilesync_filename_options
var r = cf.readFile('./caro-fs.js'); // string of data or null
var r2 = cf.readFile('./caro-fs.js', function(e, data) {
    // catch error and data
},{
    encoding: null,
    flag: null
}); // - here is default options
```
- **writeFile(path, data [cb] [opt]) - write file with data**
```javascript
// https://nodejs.org/api/fs.html#fs_fs_writefilesync_filename_data_options
var data = cf.writeFile('./test.html');
var r = cf.writeFile('./test.html', data); // boolean
var r2 = cf.writeFile('./test.html', function(e) {
    // catch error
},{
    encoding: null,
    flag: null,
    mode: null
}); // - here is default options
```
- **copyFile(path, newPath [cb] [opt]) - copy file**
```javascript
var r = cf.copyFile('./test.html', './test2.html');
var r2 = cf.copyFile('./1.jpg', './2.jpg'); // boolean
var r3 = cf.copyFile('./1.jpg', './2.jpg', function(e) {
    // catch error
},{
    encoding: null,
    flag: null
}); // - here is default options
```
- **getFsSize(path [fixed=1] [unit]) - get file size(bytes), or specific unit (KB/MB.../KiB/Mib....)**
```javascript
var r = cf.getFsSize('./caro-fs.js'); // e.g. 439078
var r2 = cf.getFsSize('./fileNotExists.js'); // null 
var r3 = cf.getFsSize(123000, 5, 'gib'); // 0.1173
```
- **humanFeSize(path [fixed=1] [si=true]) - get and cover file size for easy-reading**
```javascript
// http://en.wikipedia.org/wiki/File_size
var r = cf.humanFeSize('./caro-fs.js', 3); // e.g. '439.1 KB'
var r2 = cf.humanFeSize('./fileNotExists.js', 3); // null
var r3 = cf.humanFeSize(10000000, 2, false); // '9.54 MiB'
```
### Path
[Back to Index](#index)
- **setAbsolutePath(path) - set root absolute path**
```javascript
    var r = cf.setAbsolutePath('/path/from/root'); // '/path/from/root'
    var r2 = cf.setAbsolutePath('/path2//from\root'); // '/path2/from\root'
```
- **getAbsolutePath(path) - get root absolute path**
```javascript
    cf.setAbsolutePath('/path/from/root');
    var r = cf.getAbsolutePath(); // '/path/from/root'
```
- **normalizePath(path...) - normalize path**
```javascript
    var r = cf.normalizePath('path//seems/not/exists'); // 'path/seems/not/exists'
    var r2 = cf.normalizePath('path', '\exists'); // 'path/exists'
```
- **isFullPath(path...) - check if absolute path**
```javascript
    cf.setAbsolutePath('/path/root');
    var r = cf.isFullPath('/path/root/caro-fs.js'); // true
    var r2 = cf.isFullPath('/path/root/caro-fs.js', '/path2'); // false
```
- **getDirPath(path) - get dir-path of file**
```javascript
    var r = cf.getDirPath('/path/from/root'); // '/path/from'
    var r2 = cf.getDirPath('/path/from/root/caro-fs.js'); // '/path/from/root'
```
- **getFileName(path [getFull=true]) - get file name**
```javascript
    var r = cf.getFileName('/path/from/root'); // 'root'
    var r2 = cf.getFileName('/path/from/root/caro-fs.js'); // 'caro-fs.js'
    var r3 = cf.getFileName('/path/from/root/caro-fs.js', false); // 'caro'
```
- **getExtendName(path [withDot=true]) - get extend-name of file**
```javascript
    var r = cf.getExtendName('caro-fs.js'); // '.js'
    var r2 = cf.getExtendName('caro-fs.js.bk', false); // 'bk'
```
- **coverToFullPath(path) - cover to absolute path**
```javascript
    cf.setAbsolutePath('/path/from/root');
    var r = cf.coverToFullPath('caro-fs.js');  // '/path/from/root/caro-fs.js'
    var r2 = cf.coverToFullPath('other', 'caro-fs.js'); // '/path/from/root/other/caro-fs.js'
    var r3 = cf.coverToFullPath('/path/from/root/caro-fs.js'); // '/path/from/root/caro-fs.js'
```

### TypeCheck
[Back to Index](#index)
- **isDir(path... [cb]) - check if directory**
```javascript
var r = cf.isDir('./a'); // boolean
var r2 = cf.isDir('./a', './caro-fs.js'); // return false is one of them not directory
var r3 = cf.isDir('a', 'b', function(err, path, result){
    // catch error, path, if-directory
}); // boolean
```
- **isFile(path...) - check if file**
```javascript
var r = cf.isFile('./caro-fs.js'); // boolean
var r2 = cf.isFile('./a','./caro-fs.js'); // return false is one of them not file
var r3 = cf.isFile('a', 'b', function(err, path, result){
    // catch error, path, if-file
}); // boolean
```
- **isSymlink(path...) - check if symbolic link**
```javascript
var r = cf.isSymlink('./a','./caro-fs.js'); // boolean
var r2 = cf.isSymlink('./a','./caro-fs.js'); // return false is one of them not symbolic link
var r3 = cf.isSymlink('a', 'b', function(err, path, result){
    // catch error, path, if-symbolic
}); // boolean
```
- **getFileType(path) - get file type**
```javascript
var r = cf.getFileType('./caro-fs.js'); // dir/file/link, or ''
```

### Utility
[Back to Index](#index)
- **setFsTrace(bool) - if console.error when got exception (default=false)**
```javascript
cf.setFsTrace(true);
```
- **getStat(path [type='l']) - get file stat**
```javascript
// https://nodejs.org/api/fs.html#fs_class_fs_stats
// 'l' => lstatSync, 'f' => fstatSync, 's' => statSync
var r = cf.getStat('./caro-fs.js','l');
```
- **exists(path... [cb]) - check file if exist**
```javascript
var r = cf.exists('./caro-fs.js'); // boolean
var r2 = cf.exists('./a', './caro-fs.js'); // return false is one of them not exists
var r3 = cf.exists('a', 'b', function(err, path, result){
    // catch error, path, if-exists
}); // boolean
```
- **deleteFs(path... [force=false]) - delete file/directory**
```javascript
var r = cf.deleteFs('./1.js','./2.lnk'); // boolean
var r2 = cf.deleteFs('./test','./1.js','./2.lnk', function(err, path){
    // catch error and path
}, true);  // boolean (force-delete if possible for folder)
```
- **renameFs(path, newPath [cb] [force=false]) - rename file/directory**
```javascript
r = cf.renameFs('./a', './b/c', true); // boolean
r2 = cf.renameFs(['1.js', 'a/2.js'], ['3.js', '4.js'], function(err, path1, path2){
    // catch error and path
}, true); // boolean (force-create folder for path2 if possible)
```