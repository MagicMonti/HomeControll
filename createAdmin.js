const UserSchema = require('./router/schema/UserSchema');
const mongoose = require('mongoose');
const fs = require('fs');
const config = JSON.parse(fs.readFileSync(__dirname + '/router/config.json', 'utf8'));
const connection = mongoose.createConnection(config.database);
const UserModel = connection.model('User', UserSchema);
const crypto = require('crypto');

function createAdmin(username, password, callback){
    UserModel.findOne({
        username : req.body.username
    },function(err, user){
        //no user with this username
        if (!user){
            let user = {
                username : username,
                password : crypto.createHash('sha256').update(password).digest('base64'), //only encrypt no decrypt possible
                rule : "admin",
                idOfDevices : []
            }
            let User = new UserModel(user)
            User.save(function(err){

                if (err){
                    console.log(err);
                }
                else{
                    console.log("created admin");
                }
                callback()
            })
        }
    })
}

function resetPassword(username,password, callback){
    UserModel.findOne({
        username : username
    }, function(err,user){
        user.password = crypto.createHash('sha256').update(password).digest('base64');
        user.save(function(err){
            if (err){
                console.log(err);
            }
            else{
                console.log("changed password");
            }
            callback()
        })
    })
}

module.exports.create = createAdmin
module.exports.reset = resetPassword
