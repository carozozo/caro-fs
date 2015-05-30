# Caro-FS
The FileSystem Operator

## Install and Usage
```bash
$ npm install caro-fs
```

```javascript
var cf = require('caro-fs');
cffsExists(['caro-fs.js']); // true
```

**★[Utility](#utility)** | **[Path](#path)** | **[File](#file)** | **[Dir](#Dir)**

### FileSystem
[Back to Index](#index)
- **setFsTrace(bool) - 設定檔案操作發生錯誤時，是否顯示 console.error (default=false)**
```javascript
caro.setFsTrace(true);
```
- **readFileCaro(path [encoding='utf8'] [flag=null]) - 讀取檔案內容**
```javascript
// https://nodejs.org/api/fs.html#fs_fs_readfilesync_filename_options
var r = caro.readFileCaro('./test.html');
```
- **writeFileCaro(path, data [encoding='utf8'] [flag=null]) - 寫入檔案內容，失敗則回傳 false**
```javascript
// https://nodejs.org/api/fs.html#fs_fs_writefilesync_filename_data_options
var data = caro.readFileCaro('./test.html');
var r = caro.writeFileCaro('./test.html', data);
```
- **isEmptyDir(path... [cb]) - 判斷是否為空資料夾，其中一個不是資料夾或不是空的則回傳 false**
```javascript
var r = caro.isEmptyDir('/1'); // boolean
var r2 = caro.isEmptyDir('/1', '/2', function (err, path){
    // catch error and path
}); // boolean
```
- **readDirCb(path, cb [opt]) - 取得資料夾內容**
```javascript
caro.readDirCb('../src', function(err, oFileInfo) {
    // you can stop call-back by return false
    console.log(oFileInfo); // 檔案訊息(Object) 
    console.log(oFileInfo.filename);
    // filename 檔名
    // extendName 副檔名
    // basename 全檔名
    // filePath 檔案相對路徑
    // dirPath 資料夾相對路徑
    // fullPAth 檔案絕對路徑
    // fullDirPath 資料夾絕對路徑
    // fileType 檔案類型
    // layer 檔案在資料夾底下的第 layer 層
    // index 檔案在所屬的資料夾的第 index 個
 }, {
    maxLayer: 1, // 要讀取該資料夾底下的層級，設 0 則讀取全部
    getDir: true, // 是否讀取資料夾
    getFile: true, // 是否讀取檔案
    getByExtend: false // 指定要讀取的檔案類型， e.g. 'js,html' => 只讀取 .js/.html 檔
});
```
- **createDir(path... [cb]) - 新增資料夾，失敗則回傳 false**
```javascript
// 假設 src 底下沒有 lib 資料夾
var r = caro.createDir('./src/lib/coffee'); // boolean (will try to create /src/lib, /src/lib/coffee)
var r2 = caro.createDir('./\/test','test2/sub_test', function (err, path){
    // catch error and path
}); // boolean
```
- **fsExists(path... [cb]) - 判斷檔案/資料夾是否存在，其中一個不存在則回傳 false**
```javascript
var r = caro.fsExists('./a', './caro.js'); // boolean
var r2 = caro.fsExists('a', 'b', function(err, path){
    // catch error and path
}); // boolean
```
- **isFsDir(path... [cb]) - 判斷是否為資料夾，其中一個不是資料夾或不存在則回傳 false**
```javascript
var r = caro.isFsDir('./a','./caro.js'); // boolean
var r2 = caro.isFsDir('a', 'b', function(err, path){
    // catch error and path
}); // boolean
```
- **isFsFile(path...) - 判斷是否為檔案，其中一個不是檔案或不存在則回傳 false**
```javascript
var r = caro.isFsFile('./a','./caro.js'); // boolean
var r2 = caro.isFsFile('a', 'b', function(err, path){
    // catch error and path
}); // boolean
```
- **isFsSymlink(path...) - 判斷是否為 symbolic link，其中一個不是 symbolic link 或不存在則回傳 false**
```javascript
var r = caro.isFsSymlink('./a','./caro.js'); // boolean
var r2 = caro.isFsSymlink('a', 'b', function(err, path){
    // catch error and path
}); // boolean
```
- **getFileType(path) - 取得檔案類型**
```javascript
var r = caro.getFileType('./caro.js'); // dir/file/link，不知道類型則為 ''
```
- **deleteFs(path... [force=false]) - 刪除檔案及資料夾，其中一個刪除失敗或不存在則回傳 false**
```javascript
var r = caro.getFileType('./1.js','./2.lnk'); // boolean
var r2 = caro.getFileType('./test','./1.js','./2.lnk', function(e, path){
    // catch error and path
}, true);  // boolean (force-delete if possible for folder)
```
- **renameFs(path , newPath  [cb] [force=false]) - 檔案移動更名，失敗則回傳 false**
```javascript
r = caro.renameFs('./a', './b/c', true); // bool
r2 = caro.renameFs(['1.js', 'a/2.js'], ['3.js', '4.js'], function(err, path1, path2){
    // catch error and path
}, true); // boolean (force-create folder for path2 if possible)
```
- **getFsStat(path [type='l']) - 取得檔案資訊**
```javascript
// https://nodejs.org/api/fs.html#fs_class_fs_stats
var r = caro.getFsStat('./caro.js','l'); // l=lsataSync, f=fstatSync, s=statSync
```
- **getFsSize(path [fixed=1] [unit]) - 取得檔案大小(bytes)，或指定以「特定單位」回傳(KB/MB.../KiB/Mib....)**
```javascript
var r = caro.getFsSize('./caro.js'); // e.g. 439078
var r2 = caro.getFsSize('./caro.js', 'mb'); // e.g. 439 
var r3 = caro.getFsSize(123000, 5, 'gib'); // 0.1173
```
- **humanFeSize(bytes [fixed=1] [si=false]) - 將檔案大小轉為易讀格式**
```javascript
// http://en.wikipedia.org/wiki/File_size
var r = caro.humanFeSize('./caro.js'); // e.g. '439.1 KB'
var r2 = caro.humanFeSize('./caro.js', 3); // e.g. '439.078 KB'
var r3 = caro.humanFeSize(10000000, 2, false); // '9.54 MiB'
```

### Path
[Back to Index](#index)
- **setAbsolutePath(path) - 定義絕對路徑根目錄**
```javascript
    var r = caro.setAbsolutePath('/path/from/root'); // '/path/from/root'
    var r2 = caro.setAbsolutePath('/path2//from\root'); // '/path2/from\root'
```
- **getAbsolutePath(path) - 取得絕對路徑根目錄**
```javascript
    caro.setAbsolutePath('/path/from/root');
    var r = caro.getAbsolutePath(); // '/path/from/root'
```
- **normalizePath(path...) - 正規化路徑**
```javascript
    var r = caro.normalizePath('path//seems/not/exists'); // 'path/seems/not/exists'
    var r2 = caro.normalizePath('path', '\exists'); // 'path/exists'
```
- **isFullPath(path...) - 確認是否為絕對路徑**
```javascript
    caro.setAbsolutePath('/path/root');
    var r = caro.isFullPath('/path/root/caro.js'); // true
    var r2 = caro.isFullPath('/path/root/caro.js', '/path2'); // false
```
- **getDirPath(path) - 取得所在的資料夾路徑**
```javascript
    var r = caro.getDirPath('/path/from/root'); // '/path/from'
    var r2 = caro.getDirPath('/path/from/root/caro.js'); // '/path/from/root'
```
- **getFileName(path [getFull=true]) - 取得檔案名稱**
```javascript
    var r = caro.getFileName('/path/from/root'); // 'root'
    var r2 = caro.getFileName('/path/from/root/caro.js'); // 'caro.js'
    var r3 = caro.getFileName('/path/from/root/caro.js', false); // 'caro'
```
- **getExtendName(path [withDot=true]) - 取得附檔名**
```javascript
    var r = caro.getExtendName('caro.js'); // '.js'
    var r2 = caro.getExtendName('caro.js.bk', false); // 'bk'
```
- **coverToFullPath(path) - 轉為絕對路徑**
```javascript
    caro.setAbsolutePath('/path/from/root');
    var r = caro.coverToFullPath('caro.js');  // '/path/from/root/caro.js'
    var r2 = caro.coverToFullPath('other', 'caro.js'); // '/path/from/root/other/caro.js'
    var r3 = caro.coverToFullPath('/path/from/root/caro.js'); // '/path/from/root/caro.js'
```