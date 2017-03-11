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
        exec(`${this.executablePath} -vo null -ao null -identify -frames 0 ${videoPath}`,(err,stdout,stderr)=>{
            if( err ) cb(err,null);
            else cb(null,this._createWebVTT(stdout));
        });
    }
    createWebVTTSync(videoPath) {
        return this._createWebVTT(execSync(`${this.executablePath} -vo null -ao null -identify -frames 0 ${videoPath}`));
    }
    _createWebVTT(txt) {
        var match, data={};
        // Build a map by finding all matches in mplayer's info output
        while( match=MPlayer.CHAPTER_REGEX.exec(txt) ) {
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
        // Return a WebVTT object
        return new WebVTT(arr);
    }

    getInfo(videoPath,cb) {
        exec(`${this.executablePath} -vo null -ao null -identify -frames 0 ${videoPath}`,(err,stdout,stderr)=>{
            if( err ) cb(err,null);
            else cb(null,this._getInfo(stdout));
        });
    }
    getInfoSync(videoPath) {
        return this._getInfo(execSync(`${this.executablePath} -vo null -ao null -identify -frames 0 ${videoPath}`));
    }
    _getInfo(txt) {
        var string=new String(txt);
        var findStart=string.match(/^id_start_time=([\d.]+)$/im);
        var findDuration=string.match(/^id_length=([\d.]+)$/im);
        var findBitrate=string.match(/^id_video_bitrate=([\d.]+)$/im);
        return {
            "start": findStart.length>1?parseFloat(findStart[1]):null,
            "duration": findDuration.length>1?parseFloat(findDuration[1]):null,
            "bitrate": findBitrate.length>1?parseFloat(findBitrate[1]):null
        };
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
