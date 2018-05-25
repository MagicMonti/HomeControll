const express = require('express')
const DeviceSchema = require('./schema/DeviceSchema');
const mongoose = require('mongoose');
const fs = require('fs');
const config = JSON.parse(fs.readFileSync(__dirname + '/config.json', 'utf8'));
const httpError = require("./httpError");
if (config.debug){
    gpio = require("./gpio-test");
}
else {
    gpio = require("pi-gpio");
}
const connection = mongoose.createConnection(config.database);
const DeviceModel = connection.model('Device', DeviceSchema);
const router = express.Router()
const update = require('./update');
const jwt = require('jsonwebtoken');

const validPins = [3,5,7,8,10,11,12,13,15,16,18,19,21,22,23,24,26,27,28,29,31,32,33,34,35,36,37,38,40];

let isUserValid = require('./routerUser').isUserValid;

//TODO remove log file
//TODO read and write states in DB

//every one is able to se this
router.get('/' , function(req, res){
    DeviceModel.find({}, function(err, devices){
        if (!err){
            return res.send(devices);
        }
        return httpError.deviceNotFound(res)
    })
});



router.get('/:idOfDevice/:state/:token', function(req, res){
    let token = req.params.token;
    isUserValid(token, req.params.idOfDevice, function(state){
        if (state){
            return DeviceModel.findOne({
                _id : req.params.idOfDevice
            }, function(err, device){
                if (device){
                    device.deviceState = req.params.state;
                    return device.save(function(err){
                        if (!err){
                            let state = 0;
                            if (device.deviceState == "on")
                                state = 1;
                            if (device.deviceState == "off")
                                state = 0;

                            //the GPIO library only takes boolen values not ON or OFF
                            return gpio.write(req.params.deviceId, state, function() {
                                console.log("Device : " + req.params.idOfDevice + " is now " + state);
                                return res.send(device);
                            });
                            //update.hashOnlyStates();
                            return update.hashOnlyDevice(res);
                        }return httpErro.internalServerError(res)
                    })
                }return httpError.deviceNotFound(res)
            })
        }return httpError.forbidden(res)
    })
});

//make sure send to send JSON(application/json)

router.post('/:token' , function(req, res){
    let token = req.params.token;
    isUserValid(token, null, function(state){
        if (state){
            if (req.body.deviceId == null || req.body.name == null){
                res.send({"message": "values not valid"});
            }
            if (validPins.includes(Number(req.body.deviceId))){
                let Device = new DeviceModel(req.body)
                return Device.save(function(err){
                    if (!err){
                        update.hashOnlyDevice();
                        return res.send(Device)
                    } return httpError.internalServerError(res);
                })
            }return httpError.invalidData(res)
        }return httpError.forbidden(res)
    })
});
//TODO only admin is allowed to change devices
router.put('/:id/:token' , function(req, res){
    let token = req.params.token;
    isUserValid(token, null, function(state){
        if (state){
            return DeviceModel.findById(req.params.id, function (err, device) {
                if (!err){
                    if (req.body.name != null && req.body.name != undefined){
                        device.name = req.body.name;
                    }
                    if (req.body.deviceId != null && req.body.deviceId != undefined){
                        device.deviceId = req.body.deviceId;
                    }
                    if (req.body.deviceState != null && req.body.deviceState != undefined ){
                        device.deviceState = req.body.deviceState;
                    }
                    //includes compairs only the same Type --> Number not Strings
                    if (validPins.includes(Number(device.deviceId))){
                        return device.save(function(err){
                            if (!err){
                                update.hashOnlyDevice();
                                return res.send(device)
                            }return httpError.internalServerError(res);
                        })
                    }return httpError.invalidData(res)
                } return htppError.internalServerError(res)
            });
        }return httpError.forbidden(res);
    })
});
//TODO only admin is allowed to delete devices
router.delete('/:id/:token' , function(req, res){
    let token = req.params.token;
    isUserValid(token, null, function(state){
        if (state){
            try{
                return DeviceModel.find({ _id: req.params.id }).remove(function(){
                    update.hashOnlyDevice();
                    return res.send({"message" : "deleted"});
                });
            }catch(ex){
                return httpError.internalServerError(res)
            }
        }return httpError.forbidden(res);
    })
});


module.exports = router;
