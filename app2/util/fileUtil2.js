const fs = require("fs");

let currentPath = "/mnt/diskG/music";
let dirTree = {
  path:"first/floor/path",
  children:[]
};
var filesArr = [];

function _fileUtil(){
  this.init = function(){

  },
  this.getDirTreeEntry = function(){
    // 同步执行方法
    function getDirTree(inputPath,cb){
      let files = fs.readdirSync(inputPath);
      for(file of files){
        let filePath = inputPath + '/' + file;
        let filesState = fs.statSync(filePath);
        if(fileState.isDirectory()){
          getDirTree(filePath);
        }else{
          console.log(file);
        }
      }
      cb && cb.call();
    }
    var inputPath = './test';
    var cb = function(){
      console.log('finish');
    };
    getDirTree(inputPath,cb);
  },
  this.getMusicFiles = function(startPath,callback){
    var fileList = [];
    function readDirCount(folder,callback){
      fs.readdir(folder,function(err,files){
        var count = 0;
        var checkEnd = function(){
          console.log(folder+ ' checkEnd  count='+(count+1)+' files='+ files.length);
          ++count == files.length && callback(fileList);
        }
        files.forEach(function(file){
          var fullPath = folder + '/' + file;
          fs.stat(fullPath,function(err,stats){
            if(stats.isDirectory()){
              // console.log(fullPath + ' it is dir');
              return readDirCount(fullPath,checkEnd);
            }else{
              // console.log(fullPath + ' it is file');
              if(file&&(file.endsWith('.mp3')
                ||file.endsWith('.aac')
                ||file.endsWith('.ogg')
                ||file.endsWith('.opus')
                ||file.endsWith('.wav')
                ||file.endsWith('.flac')
                ||file.endsWith('.m4a')
                ||file.endsWith('.webm')
                ||file.endsWith('.ape'))){
                  // "mp3", "opus", "ogg", "wav", "aac", "m4a", "mp4", "webm", ...)
                  let obj = {};
                  obj.name=file;
                  obj.path = fullPath;
                  fileList.push(obj);
              }
              checkEnd();
            }
          });

        });
        files.length === 0 && callback();
      });
    }
    if(!startPath){
      startPath = '/mnt/diskG/music';
    }
    readDirCount(startPath,callback);
  }

}

module.exports = _fileUtil;
