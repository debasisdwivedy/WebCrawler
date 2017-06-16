/*
Starting point of our Application.
 */
URL = require('url');
CRAWLER = require('./Crawler')

PROJECT_NAME= 'javabrains'; // Name of the root folder
HOMEPAGE =  'https://javabrains.io/'; // Name of the website you want to crawl
DOMAIN_NAME = URL.parse(HOMEPAGE).host;
QUEUE_FILE = PROJECT_NAME +"/queued.txt";
CRAWLED_FILE = PROJECT_NAME +"/crawled.txt";
NUMBER_OF_THREADS = 8;

crawler = new CRAWLER(PROJECT_NAME,HOMEPAGE,DOMAIN_NAME,CRAWLED_FILE,QUEUE_FILE);
crawler.eventEmitter.on('initializationCompleted',function () {
    console.log('end..');
})