const express = require('express')
const UserSchema = require('./schema/UserSchema');
const mongoose = require('mongoose');
const fs = require('fs');
const config = JSON.parse(fs.readFileSync(__dirname + '/config.json', 'utf8'));
const connection = mongoose.createConnection(config.database);
const UserModel = connection.model('User', UserSchema);
const crypto = require('crypto');
const httpError = require("./httpError");
const router = express.Router()
const jwt = require('jsonwebtoken');

Array.prototype.contains = function(obj) {
    var i = this.length;
    while (i--) {
        if (this[i] === obj) {
            return true;
        }
    }
    return false;
}


function isUserValid(token, idOfDevice, callback){
    try{
        let user = jwt.verify(token, config.tokenkey);
        if (user.rule == "admin")
            callback(true)
        else{
            UserModel.findOne({
                _id : user._id
            }, function(err, user){
                if (user.idOfDevices.contains(idOfDevice)){
                    callback(true)
                }else{
                    callback(false)
                }
            })
        }
    }catch(ex){
        callback(false)
    }
}


router.get('/users/:token' , function(req, res){
    try{
        let user = jwt.verify(req.params.token, config.tokenkey);
        if (user.rule == "admin"){
            return UserModel.find({}, function(err, user){
                if (user)
                    return res.send(user)
                return httpError.userNotFound(res)
            });
        } return httpError.forbidden(res)
    }catch(ex){
        return httpError.tokenInValid(res)
    }
});
//get user
router.get('/:token', function(req, res){
    try{
        let user = jwt.verify(req.params.token, config.tokenkey);
        UserModel.findOne({
            _id : user._id
        }, function(err, user){
            if (user)
                return res.send(user)
            return httpError.userNotFound(res)
        });
    }catch(ex){
        return httpError.tokenInValid(res)
    }
})
//get token --> post is uesd to fetch body data
router.post('/token', function(req,res){
    UserModel.findOne({
        username : req.body.username,
        password : crypto.createHash('sha256').update(req.body.password).digest('base64')
    }, function(err, user){
        if (user){
            try{
                let token = jwt.sign(JSON.stringify(user), config.tokenkey);
                let msg = {
                    token : token
                }
                return res.send(msg);
            } catch(ex){
                return httpError.internalServerError(res)
            }
        }return httpError.userNotFound(res)
    });
});
//create user
router.post('/:token' , function(req, res){
    try{
        let user = jwt.verify(req.params.token, config.tokenkey);
        if (user.rule == "admin"){
            //check if user with this username allready exists
            return UserModel.findOne({
                username : req.body.username
            },function(err, user){
                //no user with this username
                if (!user){
                    try{
                        let user = {
                            username : req.body.username,
                            password : crypto.createHash('sha256').update(req.body.password).digest('base64'),
                            rule : "default",
                            idOfDevices : req.body.idOfDevices
                        }
                        let User = new UserModel(user)
                        return User.save(function(err){
                            if (!err){
                                return res.send(User)
                            }
                            return httpError.internalServerError(res)
                        })
                    }catch(ex){
                        return httpError.invalidData(res)
                    }
                }return httpError.userAllreadyExists(res)
            })
        }return httpError.forbidden(res)
    }catch(ex){
        httpError.tokenInValid(res)
    }
});

router.delete('/:token' , function(req, res){
    //TODO ask for token
    UserModel.find({ _id: req.params.id }).remove(function(){
        return res.send({"message" : "deleted"});
    });
});

router.put('/:token', function(req, res){

});


module.exports = router;
module.exports.isUserValid = isUserValid;
