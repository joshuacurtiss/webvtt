// extractWebVTT will receive a video file and use a video processing
// utility to retrieve chaper information. It then converts the output 
// into a valid WebVTT format and saves it as a file with same name/path 
// with extension .webvtt! 

// Dependencies
const WebVTT=require("./lib/WebVTT");
const WrapperController=require("./wrappers/WrapperController");
const fs=require("fs");

// Variables
var videoFilePath=process.argv[2];

// Run then process the mplayer results
if( fs.existsSync(videoFilePath) ) {
    var wc=new WrapperController();
    var wrapper=wc.wrapper;
    wrapper.createWebVTT(videoFilePath,function(err,webvtt){
        if(err) {
            console.error(err.toString());
        } else {
            // Save the WebVTT file.
            var webvttpath=videoFilePath+".webvtt";
            fs.writeFileSync(webvttpath, webvtt.toString());
            console.log(webvtt.toString());
        }
    });
} else {
    console.error("The file does not exist!");
}
