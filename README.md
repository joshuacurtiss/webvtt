# WebVTT parsing and generation in Node.js #

This library can receive WebVTT text and parses it into an array of objects 
representing the WebVTT. Correspondingly, its `toString()` method can be used
to generate WebVTT text based on the array of objects it contains.

## Get Started ##

To install all dependencies:
```
npm install
```

To run the tests (must have mocha installed):
```
mocha
```

This library ultimately uses either `ffprobe` or `mplayer` command-line 
utilities to handle the video inspection. Have them installed in the
PATH for seamless execution.

## Further Documentation ##

More info soon.
