/*
Adds the links to the crawled.txt and queued.txt files after receiving the links from Parser module
*/

var method=Crawler.prototype;
var events= require('events');
var set=require("./Set");
var Parser= require('./Parser.js');
var inventory=require('./inventory');
var URL = require('url');

/*
Class level variables
 */
var _project_dir='';
var _base_url='';
var _domain_name='';
var _crawled_file_location = '';
var _queued_file_location = '';
var _queue=new set();
var _inTransit=new set();
var _crawled=new set();
var _crawlerCount=0;

/*
Constructor
 */

function Crawler(project_dir,base_url,domain_name,crawled_file_location,queued_file_location)
{
    _project_dir=project_dir;
    _base_url=URL.format(base_url);
    _domain_name=domain_name;
    _crawled_file_location=crawled_file_location;
    _queued_file_location=queued_file_location;
    this.eventEmitter = new events.EventEmitter();
    this.init();
    this.uploadSet(true);
    this.crawl(this.increase_counter(),_base_url);
}

 method.increase_counter = function() {
    _crawlerCount++;
    return _crawlerCount;
}

method.getQueue = function() {
    return _queue;
}

method.getCrawled = function() {
    return _crawled;
}

method.init = function()
{
    var _self=this;
    inventory.createProject(_self,_project_dir,_base_url);
}


method.uploadSet = function (status) {

    //console.log("in upload set..")
    var _self=this;

    _self.eventEmitter.on('queueFileCreated', function () {
        inventory.fileToSet(_self,"_queued",_queued_file_location);
    })

    _self.eventEmitter.on('crawledFileCreated', function () {
        inventory.fileToSet(_self,"_crawled",_crawled_file_location);
    })

    _self.eventEmitter.on('fileToSet_queued',function (error,set) {
        if(error!=null)
        {
            console.log("error occurred while converting File to Set in queue.."+error.message);
            return;
        }
        //console.log('Queue set created...');
        _queue=set;
    });
    _self.eventEmitter.on('fileToSet_crawled',function (error,set) {
        if(error!=null)
        {
            console.log("error occurred while converting File to Set in crawled.."+error.message);
            return;
        }
        //console.log('Crawled set created...');
        _crawled=set;
    });

    _self.eventEmitter.on('fileToSet_queued' && 'fileToSet_crawled' , function () {
        if(status)
        {
            _self.eventEmitter.emit('setUploaded');
        }

    })
}

method.crawl = function(count,url)
{
    var _self=this;

    _self.eventEmitter.on('setUploaded',function () {

        if(!_crawled.contains(url) && !_inTransit.contains(url)) {
            _inTransit.addObj(url);
            console.log("Crawler number "+count+" crawling on "+url);
            var parser = new Parser(url);
            parser.getResponse(url);
            parser.eventEmitter.on('parsed', function (set) {
                //console.log("checking queued.. "+ _queue.details());
                //console.log("checking crawled.. "+ _crawled.details());
                //console.log("set is.. "+ set.details());
                for(var i=0;i<set.size();i++)
                {
                    var value=URL.format(set.get(i));
                    if(!_queue.contains(value) && !_crawled.contains(value) && (value==null || value.indexOf(_domain_name) >= 0))
                    {
                        _queue.addObj(value);
                    }
                }

                //console.log("added links to queue "+ _queue.details());
                _queue.deleteObj(url);
                //console.log("deleted link from the queue "+ url);
                _crawled.addObj(url);
                //console.log("added link to crawled "+ url);

                _self.eventEmitter.emit('crawlingCompleted');

            });
        }
    })
}

method.updateFile = function () {

    //console.log('in update file...')
    var _self=this;
    //console.log('queue set is...'+_queue.details())
    inventory.setToFile(_self,_queue,_queued_file_location);
    //console.log('crawled set is...'+_crawled.details())
    inventory.setToFile(_self,_crawled,_crawled_file_location);

}

module.exports = Crawler;