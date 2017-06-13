/*
Takes the url of a website and finds out the links(<a href="">) present in these websites.
It collects these links and passes it to the crawler module for further processing.

 */

var events= require('events');
var method=Parser.prototype;
var htmlparser = require("htmlparser2");
var http= require('http');
var https = require('https');
var Set = require('./Set.js');

function Parser(baseUrl) {
    _self=this;
    _self._baseUrl=baseUrl;
    _self._protocol=http;
    _self.s = new Set();
    _self.eventEmitter = new events.EventEmitter();
}

method.getProtocol = function(url)
{
    if(url.indexOf("https")>=0)
    {
        this._protocol=https;
    }

}

method.isCompleteUrl = function(url)
{
    if(url.indexOf("/")==0)
    {
        return this._baseUrl+url;
    }
    return url;
}

method.parsedData = new htmlparser.Parser({
    onopentag: function (name,attribute) {
        if(name == 'a')
        {
            var links=_self.isCompleteUrl(attribute.href);
            _self.s.addObj(links);
        }

    },
    onend: function () {
        _self.eventEmitter.emit('ready',_self.s);
        console.log("end...");
    },
},{decodeEntities : true});


method.getParsedData= function(data)
{
    this.parsedData.write(data);
    this.parsedData.end();
}

method.getResponse= function(url)
{
    var data='';
    this.getProtocol(url);
    this._protocol.get(url,(function (response) {

        response.on('data', (function (chunk) {
            data += chunk;
        }).bind(this))

        response.on('end', (function () {
            //console.log("Data is .."+ data);
            this.getParsedData(data);
        }).bind(this))

    }).bind(this))
}


module.exports = Parser;