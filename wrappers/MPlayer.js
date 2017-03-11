const WebVTT=require("../lib/WebVTT");
const child_process=require('child_process');
const exec=child_process.exec;
const execSync=child_process.execSync;

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
        });
    }

    getInfo(videoPath,cb) {
        exec(`${this.executablePath} -vo null -ao null -identify -frames 0 ${videoPath}`,(err,stdout,stderr)=>{
            if( err ) {
                cb(err,null);
            } else {
                var findStart=stdout.match(/^id_start_time=([\d.]+)$/im);
                var findDuration=stdout.match(/^id_length=([\d.]+)$/im);
                var findBitrate=stdout.match(/^id_video_bitrate=([\d.]+)$/im);
                var info={
                    "start": findStart.length>1?parseFloat(findStart[1]):null,
                    "duration": findDuration.length>1?parseFloat(findDuration[1]):null,
                    "bitrate": findBitrate.length>1?parseFloat(findBitrate[1]):null
                };
                cb(null,info);
            }
        });
    }

    executableExists() {
        var output="";
        try {
            output=execSync(this.executablePath,{encoding:"UTF-8"});
        } catch(e) {}
        return (output.indexOf("MPlayer")>=0);
    }

}

// RegEx for finding the start/end/name data in mplayer output
MPlayer.CHAPTER_REGEX=/^ID_CHAPTER_(\d{1,5})_(start|end|name)=(.*)$/gim;

module.exports=MPlayer;
