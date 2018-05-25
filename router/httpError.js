let error = {
    forbidden : function(res){
        res.status(403);
        res.send("you are not authorized")
    },
    invalidData : function(res){
        res.status(409)
        res.send("invalid data")
    },
    deviceNotFound : function(res){
        res.status(404)
        res.send("device not found")
    },
    timeStampNotFound : function(res){
        res.status(404)
        res.send("timeStamp not found")
    },
    userNotFound : function(res){
        res.status(404)
        res.send("User not found")
    },
    tokenInValid : function(res){
        res.status(409)
        res.send("token is invalid")
    },
    internalServerError : function(res){
        res.status(500)
        res.send("internalServerError");
    },
    userAllreadyExists : function(res){
        res.status(409)
        res.send("user allready Exists")
    }
}
module.exports = error;
