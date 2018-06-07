const mongoose = require('mongoose');

const Schema = mongoose.Schema;

/*const TimeStampSchema = new Schema({
    time : String,
    deviceState : String,
    repetition : String,
    timeStampState : String,
    //used to query faster
    //idOfDevice doesn't mean the Pin , it means the acutal Id --> _id
    idOfDevice : String
})*/

const DeviceSchema = new Schema({
    name:  String,
    deviceId: String,
    deviceState : String,
    timeStamps : [{
        time : String,
        deviceState : String,
        repetition : String,
        timeStampState : String,
        //used to query faster
        //idOfDevice doesn't mean the Pin , it means the acutal Id --> _id
        idOfDevice : String
    }]
},{
  usePushEach: true
});

//module.exports.timeStampSchema = TimeStampSchema
//module.exports.deviceSchema = DeviceSchema;
module.exports = DeviceSchema;
