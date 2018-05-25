let TimeStamp = function(time,deviceState,repetition,timeStampState){
    this.time = time;
    this.deviceState = deviceState;
    this.repetition = repetition;
    this.timeStampState = timeStampState;
    this.idOfTimeStamp = function(idOfTimeStamp){
        return idOfTimeStamp;
    };
    this.idOfDevice = function(idOfDevice){
        return idOfDevice;
    };
    this.writeTimeStampToDB = function(callback){
        var data = {
             "time" : this.time,
             "deviceState" : this.deviceState,
             "repetition" : this.repetition,
             "timeStampState" : this.timeStampState
        };
        $.ajax({
            type: "POST",
            url: "/timestamp/"+this.idOfDevice+"/"+localStorage.getItem("token"),
            processData: false,
            contentType: 'application/json',
            data: JSON.stringify(data),
        }).success(function(data){
            callback(data);
        }).error(function(err){
            alert(JSON.stringify(err))
        });
    };
    this.removeTimeStampFromDB = function(callback){
        $.ajax({
            type: "DELETE",
            url: "/timestamp/"+this.idOfTimeStamp+"/"+localStorage.getItem("token"),
            processData: false,
            contentType: 'application/json'
        }).success(function(data){
            callback(data);
        }).error(function(err){
            alert(JSON.stringify(err))
        });
    };
    this.updateTimeStampInDB = function(){
        //TODO
    };
    this.getTimeStamps = function(callback){
        $.get("/timestamp", function(data) {
            callback(data);
        }).error(function(err){
            alert(JSON.stringify(err))
        });
    }
    this.getTimeStampById = function(callback){
        $.get("/timestamp/"+this.idOfTimeStamp, function(data) {
            callback(data);
        }).error(function(err){
            alert(JSON.stringify(err))
        });
    }
    this.changeTimeStampState = function(callback){
        let timeStampState = ""
        if (this.timeStampState == "off"){
            timeStampState = "on";
        }
        else if (this.timeStampState == "on"){
            timeStampState = "off";
        }

        var ts = {
            "time" :this.time,
            "repetition" : this.repetition,
            "deviceState" : this.deviceState,
            "timeStampState" : timeStampState
        }
        console.log(ts);
        $.ajax({
            type: "PUT",
            url: "/timestamp/"+this.idOfTimeStamp+"/"+localStorage.getItem("token"),
            processData: false,
            contentType: 'application/json',
            data: JSON.stringify(ts),
        }).success(function(data){
            callback(data);
        }).error(function(err){
            alert(JSON.stringify(err))
        });
    }
}
