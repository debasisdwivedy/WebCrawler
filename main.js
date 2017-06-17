/*
Starting point of our Application.
 */
URL = require('url');
CRAWLER = require('./Crawler')
fs = require('fs');
var inventory=require('./inventory');
var Queue = require('queuejs');

PROJECT_NAME= 'sebastianseilund'; // Name of the root folder
HOMEPAGE =  'http://www.sebastianseilund.com'; // Name of the website you want to crawl
DOMAIN_NAME = URL.parse(HOMEPAGE).host;
QUEUE_FILE = PROJECT_NAME +"/queued.txt";
CRAWLED_FILE = PROJECT_NAME +"/crawled.txt";
NUMBER_OF_THREADS = 8;

crawler = new CRAWLER(PROJECT_NAME,HOMEPAGE,DOMAIN_NAME,CRAWLED_FILE,QUEUE_FILE);
crawler.eventEmitter.on('crawlingCompleted',function () {
    console.log('end..');
    crawler.updateFile();
    console.log("Successfully updated file ... ");

    crawler.eventEmitter.emit('queueFileCreated');
    crawler.eventEmitter.emit('crawledFileCreated');

    crawler.uploadSet();

    crawler.eventEmitter.on('setUploaded',function () {

        var s=crawler.getQueue();
        var queue = new Queue();
        if(s.size()>0)
        {
            addToQueue(s,queue);
            while(queue.size()>0)
            {
                worker(queue.deq());
            }
        }
    })
})


function worker(link)
{
    //console.log("in worker.."+link);
    crawler.crawl(crawler.increase_counter(),link,true);
}

function addToQueue(set,q)
{
    for(var i=0;i<set.size();i++)
    {
        q.enq(set.get(i));
    }
}

