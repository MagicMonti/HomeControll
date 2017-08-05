const routerDevice = require("./router/routerDevice");
const routerTimeStamp = require("./router/routerTimeStamp");
const bodyParser = require('body-parser')
const express = require('express')
const fs = require('fs');
const app = express();
const log = require("./router/log");

fs.writeFile("/log.txt", "Hey there!", function(err) {
    return console.log("The file was saved!");
}); 


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())


app.get('/',function(req, res){
    res.sendFile(__dirname + '/page/index.html');
});
app.get('/log',function(req, res){
    fs.readFile('log.txt', 'utf8', function (err,data) {
          res.send(data);
    });
});
app.get('/log/clear',function(req, res){
    log.clearLog(function(data){
        res.send(data);
    });
});

app.get('/lastLog',function(req, res){
    log.getLastLogDate(function(lastLogInFile){
        res.send(lastLogInFile);
    });
    
});

app.get('/css/:file',function(req, res){
    res.sendFile(__dirname + '/page/css/'+req.params.file);
});
app.get('/js/:file',function(req, res){
    res.sendFile(__dirname + '/page/js/'+req.params.file);
});
app.get('/img/:file',function(req, res){
    res.sendFile(__dirname + '/page/img/'+req.params.file);
});

app.use('/device', routerDevice);
app.use('/timeStamp', routerTimeStamp);

app.listen(3000, function () {
    console.log('Example app listening on port 3000!')
})
