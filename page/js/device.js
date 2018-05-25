const validPins = [3,5,7,8,11,12,13,15,16,18,19,21,22,23,24,26,27,28,29,31,32,33,34,35,36,37,38,40];

var Device = function(name,pin){
    this.name = name;
    this.pin = pin;
    this.id = function(id){
        return id;
    };
    this.isPinValid = function(){
        for (var i = 0 ; i < validPins.length ; i++){
            if (pin == validPins[i]){
                return true;
            }
            else if (i == validPins.length-1){
                return false;
            }
        }
    };
    this.writeDeviceToDB = function(callback){
        if (this.isPinValid()){
            let data = {
                 "name" : this.name,
                 "deviceId" : this.pin,
            };
            $.ajax({
                type: "POST",
                url: "/device/"+localStorage.getItem("token"),
                processData: false,
                contentType: 'application/json',
                data: JSON.stringify(data),
            }).success(function(data){
                return callback(data);
            }).error(function(err){
                alert(JSON.stringify(err))
            });
        }
        else{
            alert("This pin is not valid");
        }
    };
    this.updateDeviceInDB = function(callback){
        if (this.isPinValid()){
            var data = {
                 "name" : this.name,
                 "deviceId" : this.pin,
            };
            $.ajax({
                type: "PUT",
                url: "/device/"+this.id+"/"+localStorage.getItem("token"),
                processData: false,
                contentType: 'application/json',
                data: JSON.stringify(data)
            }).success(function(data){
                callback(data);
            }).error(function(err){
                alert(JSON.stringify(err))
            });
        }
        else{
            alert("This pin is not valid");
        }
    };
    this.removeDeviceFromDB = function(callback){
        $.ajax({
            type: "DELETE",
            url: "/device/"+this.id+"/"+localStorage.getItem("token"),
            processData: false,
            contentType: 'application/json',
        }).success(function(data){
            callback(data);
        });
    };
    this.changeDeviceState = function(str,callback){
        $.ajax({
            type: "GET",
            url: "/device/"+this.id+"/"+str+"/"+localStorage.getItem("token"),
            processData: false,
            contentType: 'application/json',
        }).success(function(data){
            callback(data);
        }).error(function(err){
            alert(JSON.stringify(err))
        });
    };
    this.loadDevices = function(callback){
        //every one is able to load devices no token neccesery
        $.get( "/device", function( data ) {
            callback(data);
        }).error(function(err){
            alert(JSON.stringify(err))
        });
    }
}
