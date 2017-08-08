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
    this.addTimeStamp = function(){
        Ajax.addTimeStamp(this.time,this.deviceState,this.repetition,this.idOfDevice,this.timeStampState,function(data){
            Ajax.loadDevices(function(data){
                Render.loadManageTimeStampPage(data);
                console.log("timeStamp has been added");
                Ajax.getUpdateRequest(function(log){
                    document.cookie = "lastlog="+log+";";
                });
            });
        });
    };
    this.removeTimeStamp = function(){
        Ajax.removeTimeStamp(this.idOfDevice,this.idOfTimeStamp, function() {
            Ajax.loadDevices(function(data){
                Render.loadManageTimeStampPage(data);
                Ajax.getUpdateRequest(function(log){
                    document.cookie = "lastlog="+log+";";
                });
            })
        })
    };
    this.updateTimeStamp = function(){
        //TODO
    };
    this.getTimeStamp = function(callback){
        let idOfTimeStamp = this.idOfTimeStamp;
        Ajax.loadDevices(function(data){
            for (var i = 0 ; i < data.length ; i++){
                for (var j = 0 ; j < data[i].timeStamp.length ; j++){
                    if (data[i].timeStamp[j]._id == idOfTimeStamp){
                        return callback(data[i].timeStamp[j]);
                    }
                }
            }
        });
    }
    this.changeTimeStampState = function(){
        let idOfDevice = this.idOfDevice;
        let idOfTimeStamp = this.idOfTimeStamp;
        this.getTimeStamp(function(timeStamp){
            if(timeStamp != undefined){
                let timeStampState = "";
                if (timeStamp.timeStampState == "off"){
                    timeStampState = "on";
                }
                else if (timeStamp.timeStampState == "on"){
                    timeStampState = "off";
                }
                var ts = {
                    "time" :timeStamp.time,
                    "repetition" : timeStamp.repetition,
                    "deviceState" : timeStamp.deviceState,
                    "timeStampState" : timeStampState
                }
                Ajax.updateTimeStamp(idOfDevice,idOfTimeStamp,ts,function(datq){
                    //TODO some log code maybe;
                });
            }
        })
    }
}
