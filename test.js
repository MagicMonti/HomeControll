const express = require('express')
var gpio = require("pi-gpio");
const DeviceSchema = require('./schema/DeviceSchema');
const mongoose = require('mongoose');
var connection = mongoose.createConnection('mongodb://localhost:27017/HomeControll');
var DeviceModel = connection.model('Device', DeviceSchema);
const routerDevice = require("./router/routerDevice");
const log = require("./router/log")
var router = express.Router()

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

function getAllDevices(){
    DeviceModel.find().exec(function(err, devices){
        console.log(devices);
    });
}

function deleteDevice(id){
    DeviceModel.find({ _id: id}).remove(function(){
        
    });
}



