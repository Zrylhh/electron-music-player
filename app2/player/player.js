var Howl = require('howler').Howl;
var Howler = require('howler').Howler;
var jsmediatags = require("jsmediatags");
const Path = require('path');
// var curHowl;

const ipc = require('electron').ipcRenderer;
// 绑定选择文件时ipc通讯
ipc.on('channel-music-list', function(event, arg){
        console.log('__get message     '+arg.length);
        var musicArr = arg;
        // currFileList = arg;
        // curObj.fileList = arg;
        var paths = [];
        for(obj of musicArr){
          // paths.push(Path.relative(__dirname,obj.path));
          obj.realPath = Path.relative(__dirname,obj.path);
          // console.log(Path.relative(__dirname,obj.path));
        }
        player = new Player(musicArr);
        // player.playlist = musicArr;
});


var Player = function(playlist) {
    // curObj
    // 记录音量 播放/暂停状态
    this.curObj = {};
    this.curObj.volume = 50;
    this.curObj.isPlay = 0;


    this.bindPageEvents();
    this.initOtherPanel();
    // curHandle
    // 记录当前播放歌曲的id
    if(playlist){
      this.playlist = playlist;
      this.index = 0;
      this.render();
    }

}

Player.prototype = {

    play: function(index) {
      if(!this.playlist){
        return false;
      }
      if(index>this.playlist.length-1){
        return false;
      }
      var self = this;
      var sound;
      index = typeof index === 'number' ? index : self.index;
      var data = self.playlist[index];
      // console.log(data);
      // 先忽略同一歌曲的问题，只要调用play就重新播放
      // 上一首 fadeOut
      // 这一首 fadeIn
      if(typeof this.curHandle != "undefined" && this.curHandle!=index){
        this.playlist[this.curHandle].howl.stop();
        // this.playlist[this.curHandle].howl.fade();
      }
      if (data && data.howl) {
        sound = data.howl;
      } else {
        sound = data.howl = new Howl({
          src: [data.realPath],
          volume: this.curObj.volume/100,
          html5: true,
          onplay: function() {
            // $scope.timer = self.formatTime(Math.round(sound.duration()));
            // requestAnimationFrame(self.step.bind(self));
            // $scope.$apply();
            // 渲染时长/动画
            //
            player.selectCheckedFile(player.index);

            $(".opration-menu .opreates .bin").removeClass('icon-play3');
            $(".opration-menu .opreates .bin").addClass('icon-pause2');
            player.curObj.isPlay = 1;

            player.curHandle = index;
            new jsmediatags.Reader(data.realPath)
              .setTagsToRead(["title", "artist","picture"])
              .read({
                onSuccess: function (tag) {
                  var titleStr = player.playlist[player.index].name;
                  if (tag.tags.title){
                    titleStr = tag.tags.title+'-'+tag.tags.artist;
                  }
                  var titleEl = document.getElementById('title');
                  title.innerHTML = titleStr;
                  var image = tag.tags.picture;
                  if (image) {
                    console.log('________________get image on play');
                    // var pic = document.getElementById('picture')
                    var base64String = "";
                    for (var i = 0; i < image.data.length; i++) {
                      base64String += String.fromCharCode(image.data[i]);
                    }
                    var base64 = "data:image/jpeg;base64," +
                      window.btoa(base64String);
                    // document.getElementById('picture').style.display = "block";
                    // document.getElementById('picture').setAttribute('src', base64);
                    // pic.style.backgroundImage = "url('" + base64 +"') ";
                  } else {
                    // document.getElementById('picture').style.display = "none";
                    // pic.style.backgroundImage = "none";
                  }
                },
                onError: function (error) {
                  console.log(':(', error.type, error.info);
                }
              });
          },
          onend: function() {
            self.skip('next');
          }
        });
      }
      sound.play();
      self.index = index;
    },
    selectCheckedFile:function(num){
      $('#file-list .file').each(function(){
        var data = $(this).attr('data');
        if(data==num){
          $(this).addClass('checked');
        }else{
          $(this).removeClass('checked');
        }
      });
    },
    skip:function(direction){
      this.pause();
      if(direction==='last'){
        if(this.index>0){

          this.play(this.index-1);
          this.selectCheckedFile(this.index-1);
        }
      }else if(direction==='next'){
        if(this.index>=0){

          this.play(this.index+1);
          this.selectCheckedFile(this.index+1);
        }
      }


    },

    pause: function() {
      this.curObj.isPlay = 0;
      $(".opration-menu .opreates .bin").removeClass('icon-pause2');
      $(".opration-menu .opreates .bin").addClass('icon-play3');
      var self = this;
      var sound = self.playlist[self.index].howl;
      sound.pause();
    },
    setVolume:function(foo){
      // 变化量，一般为0.05

      player.curObj.volume += foo;
      Howler.volume(player.curObj.volume/100);
      console.log("set volume"+player.curObj.volume);
      $('.dash-board-panel .valume').text(player.curObj.volume+'%');
    },

    render:function(){
      // 渲染页面
      // 目前只刷新音乐文件列表
      var fileListEl = document.getElementById('file-list');
      var shtml = "";
      for(var i = 0;i<this.playlist.length;i++){
        var tmp = this.playlist[i];
        shtml += '<div class="file" title="songs info" data="'+i+'">';
        shtml += '<div class="info-box">';
        shtml += '<span class="title">'+tmp.name+'</span>';
        shtml += '<span class="duration">04:03</span>';
        shtml += '<span class="info">MP3::44kHz,320kbs</span>';
        shtml += '</div>';
        shtml += '</div>';
      }
      fileListEl.innerHTML = shtml;

      $('#file-list .file').bind('dblclick',function(){
        var id = $(this).attr('data');
        id = parseInt(id);
        // $('#file-list .file').removeClass('checked');
        // $(this).addClass('checked');
        console.log("切换到"+id);
        player.play(id);
      });
    },
    initOtherPanel:function(){
      $(".valume").text(this.curObj.volume+"%");
    },
    initWaver:function(){

      // 应该绘制波形图
      // 不是siriwave
      index = typeof index === 'number' ? index : self.index;
      this.waver = this.waver ? this.waver : new SiriWave({
          container: document.getElementById('waver'),
          width: 196,
          height: 60,
          /*
          speed: 0.2,
          color: '#000',
          frequency: 2
          */
      });
    },
    bindPageEvents:function(){
      // 绑定点击关闭按钮ipc通讯
      $('.head-bar .close').unbind('click');
      $('.head-bar .close').bind('click',function(){
        console.log('--------------render_ipc_send:close');
        ipc.send('player-msg', 'close');
      });
      // 绑定点击左上（文件）按钮ipc通讯
      $('.head-bar .menu').unbind('click');
      $('.head-bar .menu').bind('click',function(){
        console.log('--------------render_ipc_send:files');
        ipc.send('player-msg', 'files');
      });

      // 加减音量
      $('.dash-board-panel .plus').unbind('click');
      $('.dash-board-panel .plus').bind('click',function(){
        player.setVolume(5);
      });
      $('.dash-board-panel .minus').unbind('click');
      $('.dash-board-panel .minus').bind('click',function(){
        player.setVolume(-5);
      });

      // 开始暂停
      $(".opration-menu .opreates .bin").unbind("click");
      $(".opration-menu .opreates .bin").bind("click",function(){
        if(player.curObj.isPlay===1){
          player.pause();
        }else if(player.curObj.isPlay===0){
          player.play();
        }
      });
      // 上一首
      $(".opration-menu .opreates .last").unbind("click");
      $(".opration-menu .opreates .last").bind("click",function(){
        player.skip('last');
      });
      // 下一首
      $(".opration-menu .opreates .next").unbind("click");
      $(".opration-menu .opreates .next").bind("click",function(){
        player.skip('next');
      });
    }

}

module.exports = Player;
