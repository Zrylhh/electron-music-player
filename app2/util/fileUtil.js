const fs = require("fs");

let currentPath = "/mnt/diskG/music";
let dirTree = {
  path:"first/floor/path",
  children:[]
};
var filesArr = [];

function _fileUtil(){
  this.getMusicFiles=function(startPath){
      console.log('entry');
      if(startPath){
        _fileUtil.getAllMusicFiles(startPath,dirTree);
      }else{
        _fileUtil.getAllMusicFiles(currentPath,dirTree);
      }
      // console.log(filesArr.length);
      // return filesArr;
  };
}
_fileUtil.prototype.getDirTree=function(){
  return dirTree;
}
_fileUtil.prototype.getFileArr=function(){
  return filesArr;
}
_fileUtil.getAllMusicFiles = function(startPath,currentTreeNode){
  if(!currentPath){
    currentPath = "/mnt/diskG/music";
    console.log("init currentPath");
  }
  if(!startPath){
    startPath = currentPath;
    console.log("init startPath");
  }
  if(!currentTreeNode){
    console.log("currentTreeNode is null!");
  }

  fs.readdir(startPath,function(err,menu){
      if(err){
        console.log("read dir error");
        return ;
      }
      if(!menu){
        return;
      }
      let currentNode = currentTreeNode;
      menu.forEach(function(ele){
          fs.stat(startPath+"/"+ele,function(err,info){
              if(info.isDirectory()){
                  console.log("dir: "+ele)
                  let node = {};
                  node.path = startPath+"/"+ele;
                  node.children = [];
                  currentNode.children.push(node);
                  _fileUtil.getAllMusicFiles(startPath+"/"+ele,node);
              }else if(info.isFile()){

                  var fileName = ele.toString();
                  if(fileName&&(fileName.endsWith('.mp3')
                    ||fileName.endsWith('.wav')
                    ||fileName.endsWith('.flac')
                    ||fileName.endsWith('.m4a')
                    ||fileName.endsWith('.ape'))){
                        // 音乐文件
                        let node = {};
                        node.path = startPath+"/"+ele;
                        node.children = [];
                        currentNode.children.push(node);
                        let file = {};
                        file.path = startPath+"/"+ele;
                        file.name = ele;
                        filesArr.push(file);
                        // console.log("music:"+ele);
                  }else{
                    // console.log("other file");
                  }

              }else{
                  console.log("something ..");
              }
          })
      })
  })
}
module.exports = _fileUtil;
