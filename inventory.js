/*
Generic file operations maintained in one file for convenience.
 */

var fs=require('fs');
var Set= require('./Set.js')
var readline=require('readline');

function set_to_file(links,file)
{
    deleteFile(file);
    links.details().forEach(function(element)
    {
        appendFile(file,element);
    })
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
        console.log("set is.."+s.details());
        crawler.eventEmitter.emit('ready',s);
    })
}

function createDirectory(directoryName,url) {
    var str = "./" + directoryName;
    fs.mkdir(str, function (error) {
        if (error) {
            console.log("Directory Exists..");
        }
        else {
            console.log("Created Directory.." + directoryName);
            createFile(str, "queued.txt",url);
            console.log("Created File..queued.txt");
            createFile(str, "crawled.txt","");
            console.log("Created File..crawled.txt");
        }
    });
}

function createFile(directory,fileName,data) {
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
    });
}

function appendFile(filePath,data) {
    fs.appendFile(filePath,"\n"+data,function(error)
    {
        if(error)
        {
            console.log("Unable to write to file "+filePath+" due to error.."+error.message)
        }
        else
        {
            console.log(data+" appended successfully!!!")
        }
    });
}

function deleteFile(filePath)
{
    fs.writeFile(filePath,"",function(error)
    {
        if(error)
        {
            console.log("Unable to delete file...");
        }
        else
        {
            console.log("Successfully deleted file...");
        }
    });
}

module.exports.createProject=createDirectory
module.exports.append=appendFile
module.exports.deleteContent=deleteFile
module.exports.fileToSet=file_to_set
module.exports.setToFile=set_to_file
