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
    this._baseUrl=baseUrl;
    this._protocol=http;
    this.s = new Set();
    this.eventEmitter = new events.EventEmitter();
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


method.getParsedData= function(data)
{
    var _self=this;
    var parsedData =new htmlparser.Parser({
        onopentag: function (name,attribute) {
            if(name == 'a')
            {
                var links=_self.isCompleteUrl(attribute.href);
                _self.s.addObj(links);
            }

        },
        onend: function () {
            _self.eventEmitter.emit('parsed',_self.s);
        },
    },{decodeEntities : true});
    parsedData.write(data);
    parsedData.end();
}

method.getResponse= function(url)
{
    var _self=this;
    var data='';
    _self.getProtocol(url);
    _self._protocol.get(url,function (response) {

        response.on('data', function (chunk) {
            data += chunk;
        })

        response.on('end', function () {
            //console.log("Data is .."+ data);
            _self.getParsedData(data);
        })

        response.on('error', function () {
            console.log("Unable to connect to  .."+ url);
        })

    })
}


module.exports = Parser;