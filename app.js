//first of all I know some variables are named horribly;
//thats why the variable "devicePin" is acutally the "deviceId"
//this means the variable name is "devicePin" but it is coded as "deviceId",
//dont't mix up with "idOfDevice" that is realy the Id of the device,
//in future I will change this naming problem
//so don't upset when you want to use the device Pin and have to use the diviceId
//----MagicMonti
const createAdmin = require("./createAdmin")
const stdio = require('stdio');

if (process.argv.slice(2) == "--create-admin"){
    stdio.question('Username ', function (err, username) {
        stdio.question('Password ', function (err, password) {
            createAdmin.create(username,password,function(){
                process.exit()
            })
        });
    });
}
if (process.argv.slice(2) == "--reset-password"){
    stdio.question('Username ', function (err, username) {
        stdio.question('Password ', function (err, password) {
            createAdmin.reset(username,password, function(){
                process.exit()
            })
        });
    });
}
else if (process.argv.slice(2) == ""){
    const routerDevice = require("./router/routerDevice");
    const routerTimeStamp = require("./router/routerTimeStamp");
    const routerUser = require("./router/routerUser");
    const bodyParser = require('body-parser')
    const express = require('express')
    const fs = require('fs');
    const app = express();
    const config = JSON.parse(fs.readFileSync(__dirname + '/router/config.json', 'utf8'));

    // parse application/x-www-form-urlencoded
    app.use(bodyParser.urlencoded({ extended: false }))
    // parse application/json
    app.use(bodyParser.json())

    app.get('/',function(req, res){
        res.sendFile(__dirname + '/page/index.html');
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
    app.use('/user', routerUser);

    app.listen(config.port, function () {
        console.log('HomeControll is running on port : ' + config.port)
    })
}
