const mongoose = require('mongoose');
const DeviceSchema = require('./schema/DeviceSchema').deviceSchema;
const TimeStampSchema = require('./schema/DeviceSchema').timeStampSchema;
const connection = mongoose.createConnection('mongodb://localhost:27018/HomeControll');
const DeviceModel = connection.model('Device', DeviceSchema);
const TimeStampModel = connection.model('TimeStamp', TimeStampSchema);


const validPins = [3,5,7,8,10,11,12,13,15,16,18,19,21,22,23,24,26,27,28,29,31,32,33,34,35,36,37,38,40];

var args = process.argv.slice(2);
if (args[0] == "--delete"){
    deleteDevice(args[1]);
    console.log("done");
}
if (args[0] == "--cLog"){
    log.clearLog(function(str){
        console.log("cleard log");
    });
}
if (args[0] == "--ldLog"){
    log.getLastDeviceLogDate(function(log){
        console.log(log);
    });
}
if (args[0]== "--lLog"){
    log.getLastLogDate(function(data){
        console.log(data);
    })
}
if (args[0] == "--devices"){
    getAllDevices();
}
if (args[0] == "--isPinValid"){
    for (var i = 0 ; i < validPins.length ; i++){
        if (args[1] == validPins[i]){
            console.log("valid");
            break;
        }
        if (i == validPins.length -1){
            console.log("not valid");
        }
    }
}
if (args[0] == "--delall"){
    TimeStampModel.remove({}, function(err) {
        console.log("timestamps are removed");
    });
    DeviceModel.remove({}, function(err) {
        console.log("devices are removed");
    });
}

function getAllDevices(){
    DeviceModel.find().exec(function(err, devices){
        console.log(devices);
    });
}

function deleteDevice(id){
    DeviceModel.find({ _id: id}).remove(function(){

    });
}
