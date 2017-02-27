const FFprobe=require("./FFprobe");
const MPlayer=require("./MPlayer");

class WrapperController {

    constructor(opts={}) {
        this.mplayer=new MPlayer(opts.hasOwnProperty("mplayer")?opts.mplayer:undefined);
        this.ffprobe=new FFprobe(opts.hasOwnProperty("ffprobe")?opts.ffprobe:undefined);
        if( this.ffprobe.executableExists() ) this.wrapper=this.ffprobe;
        else if( this.mplayer.executableExists() ) this.wrapper=this.mplayer;
        else this.wrapper=null;
        return this;
    }

}

module.exports=WrapperController;