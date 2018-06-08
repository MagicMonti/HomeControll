const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const DeviceSchema = new Schema({
    name:  String,
    pin: String,
    ip : String,
    deviceState : String,
    timeStamps : [{
        time : String,
        deviceState : String,
        repetition : String,
        timeStampState : String,
        idOfDevice : String
    }]
},{
  usePushEach: true
});

module.exports = DeviceSchema;
