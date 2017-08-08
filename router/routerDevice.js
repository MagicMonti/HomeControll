const express = require('express')
//var gpio = require("pi-gpio");
const gpio = require("./gpio-test");
const DeviceSchema = require('./schema/DeviceSchema');
const mongoose = require('mongoose');
var connection = mongoose.createConnection('mongodb://localhost:27017/HomeControll');
var DeviceModel = connection.model('Device', DeviceSchema);
var router = express.Router()
const log = require("./log");
const validPins = [3,5,7,8,10,11,12,13,15,16,18,19,21,22,23,24,26,27,28,29,31,32,33,34,35,36,37,38,40];


router.get('/:deviceId/:state', function(req, res){
    DeviceModel.find().exec(function(err, devices){
        for (var i = 0 ; i < devices.length ; i++){
            if (req.params.deviceId == devices[i].deviceId){
                gpio.open(req.params.deviceId, "output", function(err) {
                    var state = 0;
                    if (req.params.state == "on"){
                        log.addToLog("device", "["+ new Date()+"] " + devices[i].name +  " on port: " + devices[i].deviceId  + " <b>changed to " + req.params.state +"</b>", function(value){});
                        state = 1;
                    }
                    if (req.params.state == "off"){
                        log.addToLog("device","["+ new Date()+"] " + devices[i].name +  " on port: " + devices[i].deviceId  + " <b>changed to " + req.params.state + "</b>",function(value){});
                        state = 0;
                    }
                    gpio.write(req.params.deviceId, state, function() {
						console.log("Device on port" + req.params.deviceId + " is now " + state);
                        //gpio.close(req.params.deviceId);
                    });
                });
                res.send({
                    "deviceId":devices[i].deviceId,
                    "state" : req.params.state
                });
                break;
            }
        }
    });
});
router.get('/' , function(req, res){
        DeviceModel
        .find()
        .sort({name : 'asc'})
        .exec(function(err, devices){
        var deviceArray  = new Array();
        //very WIERD/CRAZY javascirpt behavieng because of the non blocking paradigma, this is why there have to be so many atributes
        //looking to preetyfy this
        for (var i = 0 ; i < devices.length ; i++){
            readPin(devices[i], i, devices, res, function(idx,array, res, updatedDevice){
                deviceArray.push(updatedDevice);
                if (idx == array.length-1){//for each goes backwards
                    res.send(deviceArray);
                }
            })
        }
    });
});


function readPin(device, idx, array, res, callback){
    //deviceId not smalet than one
    gpio.read(device.deviceId, function(err, value) {
        var d = {};
	    if (err){
	        throw err;
	    }
		if (value == 1){
		     d = {
		        "_id" : device._id,
                "name" : device.name,
                "deviceId" : device.deviceId,
                "timeStamp" : device.timeStamp,
                "state" : "on"
            }
            return callback(idx, array, res, d);
		}
		else {
		     d = {
		        "_id" : device._id,
                "name" : device.name,
                "deviceId" : device.deviceId,
                "timeStamp" : device.timeStamp,
                "state" : "off"
            }
            return callback(idx, array, res, d);
		}

    });

}


router.post('/' , function(req, res){
    if (req.body.deviceId == null || req.body.name == null){
        res.send({"message": "values not valid"});
    }
    var device = {
        name : req.body.name,
        deviceId : req.body.deviceId
    }
    for (var i = 0 ; i < validPins.length ; i++){
        if (req.body.deviceId == validPins[i]){
            DeviceModel.insertMany(device)
            .then(function(mongooseDocuments) {
                log.addToLog("device","["+ new Date()+"] device "+ device.name + " on port " + device.deviceId + " with _id " + device._id + " has been <b>added</b> to database", function(value){});
                res.send(mongooseDocuments);
            })
            .catch(function(err) {
                console.log(err);
            });
            break;
        }
        if (i == validPins.length -1){
            console.log("pin is not valid");
        }
    }



});
router.put('/:id' , function(req, res){
    DeviceModel.findById(req.params.id, function (err, device) {
        if (err){
            return handleError(err);
        }
        if (req.body.name != null){
            device.name = req.body.name;
        }
        if (req.body.deviceId != null){
            device.deviceId = req.body.deviceId;
        }
        for (var i = 0 ; i < validPins.length ; i++){
            if (req.body.deviceId == validPins[i]){
                device.save(function (err, updatedDevice) {
                    if (err){
                        return handleError(err);
                    }

                    log.addToLog("device","["+ new Date()+"] device "+ updatedDevice.name + " on port " + updatedDevice.deviceId + "widht id "  + updatedDevice._id  + " has been <b>updated</b> ",function(value){ });
                    res.send(updatedDevice);
                });
                break;
            }
            if (i == validPins.length -1){
                console.log("not valid");
            }
        }
    });
});
router.delete('/:id' , function(req, res){
    DeviceModel.find({ _id: req.params.id }).remove(function(){
        log.addToLog("device","["+ new Date()+"] device with id "+ req.params.id+ " has been removed from database",function(value){});

        res.send({"message" : "deleted"});
    });
});
module.exports = router;
