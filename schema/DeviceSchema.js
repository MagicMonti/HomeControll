var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var deviceSchema = new Schema({
    name:  String,
    deviceId: String,
    timeStamp : [{
        time : String,
        deviceState : Boolean,
        repetition : String,
        timeStampState : Boolean
    }]
});
module.exports = deviceSchema;
