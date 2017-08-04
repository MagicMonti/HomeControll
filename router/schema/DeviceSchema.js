var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var deviceSchema = new Schema({
    name:  String,
    deviceId: String,
    timeStamp : [{
        time : String,
        deviceState : String,
        repetition : String,
        timeStampState : String
    }]
});
module.exports = deviceSchema;
