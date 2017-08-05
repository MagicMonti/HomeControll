const fs = require("fs");


var addToLog = function(kindOfLog,message,callback){
    fs.readFile('log.txt', 'utf8', function (err,data) {
        if (err) {
            return console.log(err);
        }
        fs.writeFile("log.txt", data + "<span class='"+kindOfLog+" log'>"+  message + '</span><br>', function(err) {
            var str = data + "<span class='log'>"+  message + '</span><br>';
            if(err) {
                return console.log(err);
            }
            console.log("The file was saved!");
            return callback(str);
        }); 
    });
}
var clearLog = function(callback){
    var str = "<style>"+
".log{" +
    "font-family: monaco, Consolas, 'Lucida Console', monospace;"+
    "color : lightgrey;}"+
"body{"+
"background: black;}"+
"</style>";
    fs.writeFile("log.txt", str, function(err) {
        if(err) {
            return console.log(err);
        }
        console.log("The file was saved!");
        return callback(str);
    }); 
}
var getLastDeviceLogDate = function(callback){
    fs.readFile('log.txt', 'utf8', function (err,data) {
        if (err) {
            return console.log(err);
        }
        //doulbe quotes and single quotes should be this order "...''.."
        var index1 = data.lastIndexOf("<span class='device log'>[");
        var index2 = index1 + 40 //because the date between '[ ]' is 42 chars minus  and minus 2 because of the two spaces left and right
        var result = data.substring(index1+26, index2 +26); //there are 26 chars in the html tag till '['
        callback(result);
    });
}
var getLastTimeStampLogDate = function(callback){
    fs.readFile('log.txt', 'utf8', function (err,data) {
        if (err) {
            return console.log(err);
        }
        //doulbe quotes and single quotes should be this order "...''.."
        var index1 = data.lastIndexOf("<span class='timeStamp log'>[");
        var index2 = index1 + 40 //because the date between '[ ]' is 42 chars minus  and minus 2 because of the two spaces left and right
        var result = data.substring(index1+1, index2 +1);
        callback(result);
    });
}

var getLastLogDate = function(callback){
     fs.readFile('log.txt', 'utf8', function (err,data) {
        if (err) {
            return console.log(err);
        }
        var index1 = data.lastIndexOf("[");
        var index2 = index1 + 40 //because the date between '[ ]' is 42 chars inus 2 because of the two spaces left and right
        var result = data.substring(index1+1, index2 +1); //+1 to shift everything to the right
        callback(result);
    });
}

module.exports.addToLog = addToLog
module.exports.clearLog = clearLog
module.exports.getLastLogDate = getLastLogDate
module.exports.getLastDeviceLogDate = getLastDeviceLogDate