/*
Adds the links to the crawled.txt and queued.txt files after receiving the links from Parser module
*/

var method=Crawler.prototype;
var events= require('events');
var set=require("./Set");
var Parser= require('./Parser.js');
var inventory=require('./inventory');

/*
Class level variables
 */
var _project_dir='';
var _base_url='';
var _domain_name='';
var _crawled_file_location = '';
var _queued_file_location = '';
var _queue=new set();
var _crawled=new set();
var _crawlerCount=0;

/*
Constructor
 */

function Crawler(project_dir,base_url,domain_name,crawled_file_location,queued_file_location)
{
    _project_dir=project_dir;
    _base_url=base_url;
    _domain_name=domain_name;
    _crawled_file_location=crawled_file_location;
    _queued_file_location=queued_file_location;
    this.eventEmitter = new events.EventEmitter();
    this.init();
    this.crawl(_crawlerCount+1,_base_url);
}

method.init = function()
{
    var _self=this;
    inventory.createProject(_self,_project_dir,_base_url);

    this.eventEmitter.on('queueFileCreated', function () {
        inventory.fileToSet(_self,_queued_file_location);
    })

    _self.eventEmitter.on('crawledFileCreated', function () {
        inventory.fileToSet(_self,_crawled_file_location);
    })

    _self.eventEmitter.on('fileToSet',function (error,set) {
        if(error!=null)
        {
            console.log("error occurred while converting File to Set in queue.."+error.message);
            return;
        }
        _queue=set;
    });
    _self.eventEmitter.on('fileToSet',function (error,set) {
        if(error!=null)
        {
            console.log("error occurred while converting File to Set in crawled.."+error.message);
            return;
        }
        _crawled=set;
    });
}

method.updateFile = function () {
    console.log('in update file...')
    var _self=this;
    console.log('queue set is...'+_queue.details())
    inventory.setToFile(_self,_queue,_queued_file_location);
    console.log('crawled set is...'+_crawled.details())
    inventory.setToFile(_self,_crawled,_crawled_file_location);
}

method.crawl = function(count,url)
{
    if(!_crawled.contains(url)) {

        console.log("Crawler number "+count+" crawling on "+url);
        var parser = new Parser(url);
        parser.getResponse(url);
        parser.eventEmitter.on('parsed', (function (set) {
            console.log("checking queued.. "+ _queue.details());
            console.log("checking crawled.. "+ _crawled.details());
            console.log("set is.. "+ set.details());
            for(var i=0;i<set.size();i++)
            {
                var value=set.get(i);
                if(!_queue.contains(value) && !_crawled.contains(value) && (value==null || value.indexOf(_domain_name) >= 0))
                {
                    _queue.addObj(value);
                }
            }

            console.log("added links to queue "+ _queue.details());
            _queue.deleteObj(url);
            console.log("deleted link from the queue "+ url);
            _crawled.addObj(url);
            console.log("added link to crawled "+ url);

            this.updateFile();
            console.log("Successfully updated file ... ");
            this.eventEmitter.emit('initializationCompleted');
        }).bind(this));
    }
}

module.exports = Crawler;