/*
Starting point of our Application.
 */
URL = require('url');
CRAWLER = require('./Crawler')
fs = require('fs');
var async = require('async');
var inventory=require('./inventory');


PROJECT_NAME= 'sebastianseilund'; // Name of the root folder
HOMEPAGE =  'http://www.sebastianseilund.com'; // Name of the website you want to crawl
DOMAIN_NAME = URL.parse(HOMEPAGE).host;
QUEUE_FILE = PROJECT_NAME +"/queued.txt";
CRAWLED_FILE = PROJECT_NAME +"/crawled.txt";
NUMBER_OF_THREADS = 8;

crawler = new CRAWLER(PROJECT_NAME,HOMEPAGE,DOMAIN_NAME,CRAWLED_FILE,QUEUE_FILE);
crawler.eventEmitter.on('crawlingCompleted',function () {
    //console.log('end..');
    crawler.updateFile();
    //console.log("Successfully updated file ... ");

    crawler.eventEmitter.emit('queueFileCreated');
    crawler.eventEmitter.emit('crawledFileCreated');

    crawler.uploadSet(true);

    crawler.eventEmitter.on('setUploaded',function () {

        var s=crawler.getQueue();
        if(s.size()>0)
        {
            var q = async.forEachSeries(s.details(),function (link,callback) {
                worker(link);
            });
        }
    })
})


function worker(link)
{
    //console.log("in worker.."+link);
    crawler.crawl(crawler.increase_counter(),link);
    crawler.updateFile();
    crawler.eventEmitter.emit('queueFileCreated');
    crawler.eventEmitter.emit('crawledFileCreated');

    crawler.uploadSet(false);
}

