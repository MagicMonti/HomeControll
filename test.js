const express = require('express')
var gpio = require("pi-gpio");
const DeviceSchema = require('./schema/DeviceSchema');
const mongoose = require('mongoose');
var connection = mongoose.createConnection('mongodb://localhost:27017/HomeControll');
var DeviceModel = connection.model('Device', DeviceSchema);
const routerDevice = require("./router/routerDevice");
const log = require("./router/log")
var router = express.Router()

log.getLastLogDate(function(data){
    console.log(data);
})

/*
var args = process.argv.slice(2);
if (args[0] == "--delete"){
    deleteDevice(args[1]);   
    console.log("done");
}
else{
    getAllDevices();
}
*/

function getAllDevices(){
    DeviceModel.find().exec(function(err, devices){
        console.log(devices);
    });
}

function deleteDevice(id){
    DeviceModel.find({ _id: id}).remove(function(){
        
    });
}



