## electron-music-player

a simple desktop music player build with electron and Jquery.

AIMP is a excellent player,but i can't use it in Linux ,that's why i draw this player follow AIMP and this **[skin](http://www.aimp.ru/forum/index.php?topic=23859)**.

![Screenshot](https://github.com/Zrylhh/electron-music-player/blob/master/app2/Screenshot-from-2018-09-10-.png?raw=true "the player")


### how to use

```
  git clone https://github.com/Zrylhh/electron-music-player.git

  cd electron-music-player

  npm install

  npm run start

```

### Q&A

1. why not draw a transparent background?

    I think it's a problem for me because [this](https://github.com/electron/electron/blob/master/docs/api/frameless-window.md#limitations)
    >On Linux, users have to put --enable-transparent-visuals --disable-gpu in the command line to disable GPU
    and allow ARGB to make transparent window, this is caused by an upstream bug that alpha channel
    doesn't work on some NVidia drivers on Linux.

    I have checked version,grammar but still have no clue,so i think it's drivers's problem. If you have solution,issue is welcomed. 
