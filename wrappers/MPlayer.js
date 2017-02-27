const WebVTT=require("../lib/WebVTT");
const exec=require('child_process').exec;

class MPlayer {

    constructor(executablePath) {
        this.executablePath=executablePath||"mplayer";
        return this;
    }

    createWebVTT(videoPath,cb) {
        var match, data={};
        exec(`${this.executablePath} -vo null -ao null -identify -frames 0 ${videoPath}`,(err,stdout,stderr)=>{
            if( err ) {
                cb(err,null);
            } else {
                // Build a map by finding all matches in mplayer's info output
                while( match=MPlayer.CHAPTER_REGEX.exec(stdout) ) {
                    var id=match[1],
                        key=match[2].toLowerCase(),
                        value=match[3];
                    if( !data[id] ) data[id]={id:id};
                    if( key=="start" || key=="end" ) value=parseFloat(value)/1000;
                    data[id][key]=value;
                }
                // Convert the map to a list
                var arr=[];
                for( var objkey in data ) {arr.push(data[objkey])}
                // Put the data into WebVTT object
                var webvtt=new WebVTT(arr);
                cb(null,webvtt);
            }
        })
    }

}

// RegEx for finding the start/end/name data in mplayer output
MPlayer.CHAPTER_REGEX=/^ID_CHAPTER_(\d{1,5})_(start|end|name)=(.*)$/gim;

module.exports=MPlayer;
