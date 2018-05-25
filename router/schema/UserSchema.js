const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    username : String,
    password : String,
    rule : String,
    idOfDevices : [String]
});
module.exports = UserSchema;
