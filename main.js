/*
Starting point of our Application.
 */
URL = require('url');
CRAWLER = require('./Crawler')
fs = require('fs');
var inventory=require('./inventory');

PARENT_DIR='Local_File'; // The root directory where the files will be stored
HOMEPAGE =  ''; // Name of the website you want to crawl(http://www.javabrains.io)
DOMAIN_NAME = URL.parse(HOMEPAGE).host;
PROJECT_NAME= PARENT_DIR+'/'+DOMAIN_NAME; // Name of the root folder
QUEUE_FILE = PROJECT_NAME +"/queued.txt";
CRAWLED_FILE = PROJECT_NAME +"/crawled.txt";
NUMBER_OF_THREADS = 8;

crawler = new CRAWLER(PROJECT_NAME,HOMEPAGE,DOMAIN_NAME,CRAWLED_FILE,QUEUE_FILE);

crawler.eventEmitter.on('1_crawlingCompleted',function () {
    console.log(crawler.getCrawlerCount());
    var s=crawler.getQueue();

    if(s.size()>0)
    {
        worker(s,complete);
    }
    else
    {
        console.log("No files in queue list...");
        complete();
        return;
    }
})

var complete = function () {
    console.log(".....");
    crawler.updateFile();
    console.log("Successfully updated file ... ");
}

function worker(set,callback)
{
    console.log("in worker module.."+set.get(0));
    var count=crawler.increase_counter();
    crawler.crawl(count,set.get(0),true,false);
    crawler.eventEmitter.on(count+'_crawlingCompleted',function () {
        console.log(crawler.getCrawlerCount());
        var s=crawler.getQueue();
        if(s.size()>0)
        {
            worker(s,callback);
        }
        else
        {
            console.log("No files in queue list...");
            callback();
            return;
        }
    })
}
