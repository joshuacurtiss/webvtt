const expect=require("chai").expect;
const WebVTT=require("../lib/WebVTT");

describe("WebVTT", function() {

    describe("set data", function() {
        it(`should parse a WebVTT string`)
        it(`should receive an array of objects`)
        it(`should throw error for other data types`)
    })

    describe("sanitize()", function() {
        it(`should clean array of non-object data`)
        it(`should convert "name" key to "content"`)
        it(`should clean objects of unexpected keys (id, start, end, content)`)
        it(`should set id to empty string if it doesn't exist`)
        it(`should set start to zero if it doesn't exist`)
        it(`should set end to zero if it doesn't exist`)
        it(`should set content to empty string if it doesn't exist`)
    })

    describe("parseWebVTT()", function() {
        it(`should parse valid WebVTT`)
        it(`should parse valid SRT`)
        it(`should skip bad entries in WebVTT`)
    })

    describe("toString()", function() {
        it(`should generate WebVTT text from its data`)
    })

});