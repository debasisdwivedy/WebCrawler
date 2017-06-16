/*
Generic file operations maintained in one file for convenience.
 */

var fs=require('fs');
var Set= require('./Set.js')
var readline=require('readline');

function set_to_file(crawler,links,file)
{
    console.log('in function set_to_file..'+file);
    deleteFile(file);
    var appendStream = fs.createWriteStream(file,{'flags': 'a'});

    for(var i=0;i<links.details().length;i++)
    {
        appendStream.write(links.details()[i]+"\n");
    }

    appendStream.end();

}

function file_to_set(crawler,fileName)
{
    var s=new Set();
    var rl = readline.createInterface({
        input : fs.createReadStream(fileName),
        output: process.stdout,
        terminal: false
    })


    rl.on('line', function(line)
    {
        s.addObj(line);

    })

    rl.on('close',function()
    {
        console.log("fileToSet is.."+s.details());
        crawler.eventEmitter.emit('ready',null,s);
    })

    rl.on('error',function(err)
    {
        crawler.eventEmitter.emit('ready',err,s);
    })

}

function createDirectory(crawler,directoryName,url) {
    var str = "./" + directoryName;
    fs.mkdir(str, function (error) {
        if (error) {
            console.log("Directory Exists..");
        }
        else {
            console.log("Created Directory.." + directoryName);
            createFile(crawler,str, "queued.txt",url);
            console.log("Created File..queued.txt");
            createFile(crawler,str, "crawled.txt","");
            console.log("Created File..crawled.txt");
        }
    });
}

function createFile(crawler,directory,fileName,data) {
    var path=directory+"/"+fileName;
    if(!fs.exists(path))
    {
        fs.openSync(path,"w");
    }
    fs.writeFile(path,data,function(error)
    {
        if(error)
        {
            console.log("Unable to write "+fileName+"in "+directory+" due to error.."+error.message)
        }
        else
        {
            if(fileName =='queued.txt')
            {
                crawler.eventEmitter.emit('queueFileCreated');
            }
            else
            {
                crawler.eventEmitter.emit('crawledFileCreated');
            }

        }
    });
}


function deleteFile(filePath)
{
    var createStream = fs.createWriteStream(filePath,{'flags': 'w'});
    createStream.write('');
    createStream.end();
    console.log("file deleted...")
}

module.exports.createProject=createDirectory
module.exports.deleteContent=deleteFile
module.exports.fileToSet=file_to_set
module.exports.setToFile=set_to_file
