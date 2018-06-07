const mongoose = require('mongoose');
const DeviceSchema = require('./schema/DeviceSchema');
const fs = require('fs');
const config = JSON.parse(fs.readFileSync(__dirname + '/config.json', 'utf8'));
const connection = mongoose.createConnection(config.database);
const DeviceModel = connection.model('Device', DeviceSchema);
let isUserValid = require('./routerUser').isUserValid;
const express = require('express');
const httpError = require("./httpError");
if (config.debug){
    gpio = require("./gpio-test");
}
else {
    gpio = require("pi-gpio");
}
var router = express.Router()

//BACKGROUND WORKERconst DeviceModel = connection.model('Device', DeviceSchema);

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
                        console.log(id + " to " + state);
                        //TODO save state in DB

                    });
                });
            }
        }
    })
},1000);


function isTimeValid(timeString,repetition,date){
    if (timeString == null || timeString == undefined){
        return false;
    }
    if (repetition == null || repetition == undefined){
        return false;
    }
    if (date == null || date == undefined){
        return false;
    }
    else{
        try {
            var timeArray = timeString.split(":");
            var repetitionArray = repetition.split(",");
            for (var i = 0 ; i < repetitionArray.length ; i++){
                if (repetitionArray[i] == date.getDay()){
                    if (timeArray[0] == date.getHours() && timeArray[1] == date.getMinutes() && timeArray[2] == date.getSeconds()){
                        return true;
                    }
                }
            }
        }catch(err){
            console.log("time is not valid" + err);
        }
    }
    return false;
}

function getAllTimeStamps(callback){
    var timeStamps = new Array();
    DeviceModel.find().exec(function(err, devices){
        for (var i = 0 ; i < devices.length;i++){
            for (var j = 0; j < devices[i].timeStamps.length;j++){
                //copies the Object
                let data = JSON.parse(JSON.stringify( devices[i].timeStamps[j]));
                data.deviceId = devices[i].deviceId;
                data.name = devices[i].name;
                timeStamps.push(data);
            }
        }
        callback(timeStamps);
    });
}
//TODO find a faster solution
function getDeviceByTimeStampId(timeStampId, callback){
    DeviceModel.find({}, function(err, devices){
        if (devices == null || devices == undefined || devices.length == 0){
            callback(null)
        } else {

            for (let i = 0; i < devices.length ; i++){
                for (let j = 0 ; j < devices[i].timeStamps.length ; j++){
                    if (devices[i].timeStamps[j]._id == timeStampId){
                        return callback(devices[i])
                    }
                }
            }
            return callback(null)
        }
    });
}
//TODO find a faster solution
function getTimeStampById(timeStampId , callback){
    DeviceModel.find({}, function(err, devices){
        if (devices == null || devices == undefined || devices.length == 0){
            callback(null)
        } else {
            for (let i = 0; i < devices.length ; i++){
                for (let j = 0 ; j < devices[i].timeStamps.length ; j++){
                    if (devices[i].timeStamps[j]._id == timeStampId){
                        //copies the Object
                        let data = JSON.parse(JSON.stringify( devices[i].timeStamps[j]));
                        data.name =  devices[i].name
                        return callback(data)
                    }
                }
            }
            return callback(null)
        }
    });
}
//TODO only users are allowed to see timestamps
router.get('/:timeStampId' , function(req, res){
    getTimeStampById(req.params.timeStampId, function(timeStamp){
        if (timeStamp)
            return res.send(timeStamp);
        return httpError.timeStampNotFound(res)
    })
});

//TODO only admins are allowed to manage timestamps
router.post('/:id/:token' , function(req, res){
    let token = req.params.token;
    //null --> no id given --> only admins are allowed
    isUserValid(token, null, function(state){
        if(isTimeStampValid(req.body)){
            return DeviceModel.findById(req.params.id,
            function(err, device){
                if (device){
                    let timeStamp = JSON.parse(JSON.stringify(req.body));
                    timeStamp.idOfDevice = req.params.id;
                    device.timeStamps.push(timeStamp);
                    return device.save(function(err){
                        if (!err)
                            return res.send(device);
                        console.log(err);
                        return httpError.internalServerError(res);
                    })
                }
                return httpError.deviceNotFound(res);
            });
        } return httpError.forbidden(res)
    })

});
//TODO check if values are valid
router.put('/:timeStampId/:token' , function(req, res){
    let token = req.params.token;
    //null --> no id given --> only admins are allowed
    isUserValid(token, null, function(state){
        if (state){
            if (isTimeStampValid(req.body)){
                return getDeviceByTimeStampId(req.params.timeStampId, function(device){
                    if (device){
                        var subDoc = device.timeStamps.id(req.params.timeStampId);
                        subDoc.set(req.body);
                        return device.save().then(function(updatedDevice) {
                            return res.send(updatedDevice);
                        }).catch(function(err) {
                            return httpError.internalServerError(res)
                        });
                    }return httpError.deviceNotFound(res)
                });
            } return httpError.invalidData(res);
        } return httpError.forbidden(res)
    });
});
router.get('/' , function(req, res){
    getAllTimeStamps(function(timeStamps){
        if (timeStamps)
            return res.send(timeStamps);
        return htppError.timeStampNotFound(res)
    })

});


//TODO only admins are allowed to manage timestamps
router.delete('/:timeStampId/:token' , function(req, res){
    let token = req.params.token;
    //null --> no id given --> only admins are allowed
    isUserValid(token, null, function(state){
        if (state){
            return getDeviceByTimeStampId(req.params.timeStampId, function(device){
                if (device){
                    let subDoc = device.timeStamps.id(req.params.timeStampId);
                    device.timeStamps.pop(subDoc);
                    return device.save().then(function(updatedDevice) {
                        return res.send(updatedDevice);
                    }).catch(function(err) {
                        return httpError.internalServerError(res)
                    });
                } return httpError.deviceNotFound(res)
            });
        } return httpError.forbidden(res);
    });
});

//TODO is time real a time format
//TODO is repition also a real formant like 1,2,3 .. and if timeStampState == on or off same for deviceState
function isTimeStampValid(ts){
    if (ts.time == null || ts.time == undefined){
        console.log("time is not valid");
        return false;
    }
    if (ts.deviceState == null || ts.deviceState == undefined ){
        console.log("deviceState is not valid");
        return false;
    }
    if (ts.repetition == null || ts.repetition == undefined){
        console.log("repition is not valid");
        return false;
    }
    if (ts.timeStampState == null || ts.timeStampState == undefined ){
        console.log("timeStampState is not valid");
        return false;
    }
    return true;
}
module.exports = router;
