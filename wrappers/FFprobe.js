const WebVTT=require("../lib/WebVTT");
const child_process=require('child_process');
const execFile=child_process.execFile;
const execFileSync=child_process.execFileSync;

class FFprobe {

    constructor(executablePath) {
        this.executablePath=executablePath||"ffprobe";
        return this;
    }

    createWebVTT(videoPath,cb) {
        execFile(this.executablePath,[`-show_chapters`,`-of`,`json`,videoPath],(err,stdout,stderr)=>{
            if( err ) cb(err,null);
            else cb(null,this._createWebVTT(stdout));
        });
    }
    createWebVTTSync(videoPath) {
        return this._createWebVTT(execFileSync(this.executablePath,[`-show_chapters`,`-of`,`json`,videoPath]));
    }
    _createWebVTT(json) {
        var data=JSON.parse(json);
        var chapters=data.chapters;
        // Loop thru chapters to adjust data
        for( var chapter of chapters ) {
            // Parse the start/end values
            chapter.start=parseFloat(chapter.start_time);
            chapter.end=parseFloat(chapter.end_time);
            // Pull out the tags
            for( var tag in chapter.tags )
                chapter[tag]=chapter.tags[tag];
        }
        // Return a WebVTT object
        return new WebVTT(chapters);
    }

    getInfo(videoPath,cb) {
        execFile(this.executablePath,[`-show_format`,`-of`,`json`,videoPath],(err,stdout,stderr)=>{
            if( err ) cb(err,null);
            else cb(null,this._getInfo(stdout));
        });
    }
    getInfoSync(videoPath) {
        return this._getInfo(execFileSync(this.executablePath,[`-show_format`,`-of`,`json`,videoPath]));
    }
    _getInfo(json) {
        var data=JSON.parse(json);
        return {
            "start": parseFloat(data.format["start_time"]),
            "duration": parseFloat(data.format["duration"]),
            "bitrate": parseFloat(data.format["bit_rate"])
        };
    }

    executableExists() {
        var output="";
        try {
            output=execFileSync(this.executablePath,[`-version`],{encoding:"UTF-8"});
        } catch(e) {}
        return (output.indexOf("ffprobe")>=0);
    }

}

module.exports=FFprobe;
