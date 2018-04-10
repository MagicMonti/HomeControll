const DeviceSchema = require('./schema/DeviceSchema');
const mongoose = require('mongoose');
const fs = require('fs');
const config = JSON.parse(fs.readFileSync(__dirname + '/config.json', 'utf8'));
const connection = mongoose.createConnection(config.database);
const DeviceModel = connection.model('Device', DeviceSchema);
const crypto = require('crypto');
const ws = require("nodejs-websocket")

let Update = {
    hashAll : function(){
        DeviceModel.find({}, function(err, res){
            let str = JSON.stringify(res);
            let hash = crypto.createHash('sha256').update(str).digest('base64');
            Update.hashAllString = hash;
        })
    },
    hashOnlyDevice : function(){
        let query = DeviceModel.find({}).select('-timeStamps -_id');
        query.exec(function (err, res) {
           if (!err){
               let str = JSON.stringify(res);
               let hash = crypto.createHash('sha256').update(str).digest('base64');
               Update.hashOnlyDeviceString = hash;
           }
        });
    }

}
// Scream server example: "hi" -> "HI!!!"

const server = ws.createServer(function (conn) {
    conn.path = '/update';
    console.log("Got a new Connection")
    let count = 0;
    let interval = setInterval(function () {
        if (count == 0){
            Update.hashOnlyDevice();
        }
        else{
            try{
                conn.sendText(Update.hashOnlyDeviceString);
            }catch(ex){
                clearInterval(interval);
            }
        }
        count++;
    }, 500)
    /*conn.on("close", function (code, reason) {
        console.log("Connection closed")
    })*/
}).listen(config.websocket)



module.exports = Update;
