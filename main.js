const {app, BrowserWindow, dialog, Menu} = require('electron');
const path = require('path');
const url = require('url');
const _fileUtil = require('./app2/util/fileUtil2.js');
const fs = require('fs');
const ipc = require('electron').ipcMain

let win;

function createWindow () {
  // Create the browser window.
  win = new BrowserWindow({
    // width: 900,
    // height: 550,
    width:384,
    height:484,
    // resizable: false,
    icon: __dirname + '/music-player.ico',
    // backgroundColor: 'rgba(0,0,0,0.000)',
    // transparent: true,
    frame: false
  })


  // Open the DevTools.
  // win.webContents.openDevTools();
  // var menu = Menu.buildFromTemplate([
  //   {
  //       label: 'Folders',
  //       accelerator: 'CommandOrControl+o',
  //       click: function(){
  //             openFolderDialog()
  //           }
  //   },
  //   {
  //       label: 'Info'
  //   }
  // ])
  // Menu.setApplicationMenu(menu)

  // and load the index.html of the app.
  // win.loadURL(url.format({
    // pathname: path.join(__dirname, './app2/index.html')
    // protocol: 'file:',
    // slashes: true
  // }))
  const modalPath = path.join('file://', __dirname, './app2/index2.html')

  win.loadURL(modalPath);

  // Open the DevTools.
  // win.webContents.openDevTools()

  // Emitted when the window is closed.
  win.on('closed', () => {
    win = null
  })
}

app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (win === null) {
    createWindow()
  }
})

function openFolderDialog(){
  dialog.showOpenDialog(win,{
    properties: ['openDirectory']
  },function(filePath){

    if(!filePath) return;
    var fuObj = new _fileUtil();
    console.log("path:"+filePath[0]);
    var musicArr = [];
    // 异步获取文件列表
    fuObj.getMusicFiles(filePath[0],function(arr){
      musicArr = arr;
      console.log("arrlength:"+musicArr.length);
      win.webContents.send('channel-music-list', musicArr);
    });
  })
}
// 注册通讯事件
ipc.on('player-msg', function (event, arg) {
  console.log('----------ipc_main_get:'+arg);
  if(arg==='close'){
    // win = null;
    win.close();
  }else if(arg==='files'){
    openFolderDialog();
  }

})
