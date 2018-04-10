const express = require('express')
const DeviceSchema = require('./schema/DeviceSchema');
const mongoose = require('mongoose');
const fs = require('fs');
const config = JSON.parse(fs.readFileSync(__dirname + '/config.json', 'utf8'));
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

const validPins = [3,5,7,8,10,11,12,13,15,16,18,19,21,22,23,24,26,27,28,29,31,32,33,34,35,36,37,38,40];

//TODO remove log file
//TODO read and write states in DB


router.get('/:deviceId/:state', function(req, res){
    DeviceModel.findOne({
        deviceId : req.params.deviceId
    }, function(err, device){
        if (device != null && device != undefined){
            device.deviceState = req.params.state;
            device.save(function(err){
                if (err)
                    console.log(err);
                else{
                    let state = 0;
                    if (device.deviceState == "on")
                        state = 1;
                    if (device.deviceState == "off")
                        state = 0;

                    //the GPIO library only takes boolen values not ON or OFF
                    gpio.write(req.params.deviceId, state, function() {
                        console.log("Device on port" + req.params.deviceId + " is now " + state);
                        res.send(device);
                    });
                    //update.hashOnlyStates();
                    update.hashOnlyDevice();
                }

            })
        }
    })
});


router.get('/' , function(req, res){
    DeviceModel.find({}, function(err, devices){
        if (err){
            console.log(err);
        }
        else{
            res.send(devices);
        }
    })
});


//make sure send to send JSON(application/json)
router.post('/' , function(req, res){
    if (req.body.deviceId == null || req.body.name == null){
        res.send({"message": "values not valid"});
    }
/*    let device = {
        name : req.body.name,
        deviceId : req.body.deviceId
    }*/
    if (validPins.includes(Number(req.body.deviceId))){
        let Device = new DeviceModel(req.body)
        Device.save(function(err){
            if (err){
                console.log(err);
            }
            else{
                res.send(Device)
                update.hashOnlyDevice();
            }
        })
    }

});
router.put('/:id' , function(req, res){
    DeviceModel.findById(req.params.id, function (err, device) {

        if (err){
            return handleError(err);
        }
        else{
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
                device.save(function(err){
                    if (err){
                        console.log(err);
                    }
                    else{
                        update.hashOnlyDevice();
                        res.send(device)
                    }
                })
            }
        }

    });
});
router.delete('/:id' , function(req, res){
    DeviceModel.find({ _id: req.params.id }).remove(function(){
        update.hashOnlyDevice();
        res.send({"message" : "deleted"});
    });
});


module.exports = router;
