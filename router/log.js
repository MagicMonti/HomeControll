const fs = require("fs");


var addToLog = function(message,callback){
    fs.readFile('log.txt', 'utf8', function (err,data) {
        if (err) {
            return console.log(err);
        }
        fs.writeFile("log.txt", data + "<span class='log'>"+  message + '</span><br>', function(err) {
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


module.exports.addToLog = addToLog
module.exports.clearLog = clearLog