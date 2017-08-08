const mongoose = require('mongoose');
const DeviceSchema = require('./schema/DeviceSchema');
connection = mongoose.createConnection('mongodb://localhost:27017/HomeControll');
var DeviceModel = connection.model('Device', DeviceSchema);
const express = require('express');
//var gpio = require("pi-gpio");
const gpio = require("./gpio-test");
const log = require("./log");
var router = express.Router()


setInterval(function () {
    var currentdate = new Date();
    getAllTimeStamps(function(timeStamps){
        for (var i = 0 ; i < timeStamps.length; i++){
            if (isTimeValid(timeStamps[i].time , timeStamps[i].repetition, currentdate) && timeStamps[i].timeStampState == "on"){
                console.log("turning "  +  timeStamps[i].name  + " at port: " + timeStamps[i].deviceId + " to "  + timeStamps[i].deviceState);
                var deviceState = timeStamps[i].deviceState;
                var id = timeStamps[i].deviceId;
                gpio.open(timeStamps[i].deviceId, "output", function(err) {
                    var state = 0;
                    if (deviceState == "on"){
                        state = 1;
                    }
                    if (deviceState == "off"){
                        state = 0;
                    }
                    gpio.write(id, state, function() {
                         log.addToLog("timeStamp", "["+ new Date()+"]  pin: " + id  + " <b>changed to " + state +"</b> set by timeStamp", function(value){});
                    });
                });
            }
        }
    })
},1000);


function isTimeValid(timeString,repetition,date){
    var timeArray = timeString.split(":");
    var repetitionArray = repetition.split(",");
    for (var i = 0 ; i < repetitionArray.length ; i++){
        if (repetitionArray[i] == date.getDay()){
            if (timeArray[0] == date.getHours() && timeArray[1] == date.getMinutes() && timeArray[2] == date.getSeconds()){
                return true;
            }
        }
    }
    return false;
}

function getAllTimeStamps(callback){
    var timeStamps = new Array();
    DeviceModel.find().exec(function(err, devices){
        for (var i = 0 ; i < devices.length;i++){
            for (var j = 0; j < devices[i].timeStamp.length;j++){
                var timeStamp  = {
                    time : devices[i].timeStamp[j].time,
                    deviceState : devices[i].timeStamp[j].deviceState,
                    repetition : devices[i].timeStamp[j].repetition,
                    timeStampState : devices[i].timeStamp[j].timeStampState,
                    deviceId : devices[i].deviceId,
                    name : devices[i].name
                }

                timeStamps.push(timeStamp);
            }
        }
        callback(timeStamps);

    });
}
router.get('/' , function(req, res){
    console.log("print all TimeStamps");
    getAllTimeStamps(function(timeStamps){
        res.send(timeStamps);
    })
});
router.post('/:id' , function(req, res){
    isTimeStampValid(req,res);
    DeviceModel.findByIdAndUpdate(req.params.id,
        {$push: {
                "timeStamp": {
                    time : req.body.time,
                    deviceState : req.body.deviceState,
                    repetition : req.body.repetition,
                    timeStampState : req.body.timeStampState
                 }
             }
         },
        {safe: true, upsert: true, new : true},
        function (err, device) {
            log.addToLog("timeStamp", "["+ new Date()+"]  A new TimeStamp has been added to DB", function(value){});
            res.send(device);
    })

});
router.put('/:id/:timeStampId' , function(req, res){
    isTimeStampValid(req,res);
    var timeStamp = {
        time : req.body.time,
        deviceState : req.body.deviceState,
        repetition : req.body.repetition,
        timeStampState : req.body.timeStampState
    }

    DeviceModel.findById(req.params.id, function(err, device) {
      var subDoc = device.timeStamp.id(req.params.timeStampId);

      subDoc.set(timeStamp);

      // Using a promise rather than a callback
      device.save().then(function(updatedDevice) {
          log.addToLog("timeStamp", "["+ new Date()+"]  updated TimeStamp with id: " + req.params.timeStampId , function(value){});
            res.send(updatedDevice);
      }).catch(function(err) {
        res.status(500).send(err);
      });
  });

});
router.delete('/:id/:timeStampId' , function(req, res){


    DeviceModel.findById(req.params.id, function(err, device) {
      device.timeStamp.id(req.params.timeStampId).remove();

      // Using a promise rather than a callback
      device.save().then(function(updatedDevice) {
        res.send(updatedDevice);
        log.addToLog("timeStamp", "["+ new Date()+"]  delete TimeStamp with id: " + req.params.timeStampId , function(value){});
      }).catch(function(err) {
        res.status(500).send(err);
      });
  });
});

function isTimeStampValid(req,res){
    if (req.body.time == null){
        res.send({"message" : "missing time"})
    }
    if (req.body.deviceState == null){
        res.send({"message" : "missing deviceState"})
    }
    if (req.body.repetition == null){
        res.send({"message" : "missing repetition"})
    }
    if (req.body.timeStampState == null){
        res.send({"message" : "missing timeStampState"})
    }
}
module.exports = router;
