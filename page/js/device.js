var Device = function(name,pin,ip){
    this.name = name;
    this.pin = pin;
    this.ip = ip;
    this.id = function(id){
        return id;
    };
    this.writeDeviceToDB = function(callback){
        let data = {
             "name" : this.name,
             "pin" : this.pin,
             "ip" : this.ip
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
    };
    this.updateDeviceInDB = function(callback){
        var data = {
             "name" : this.name,
             "pin" : this.pin,
             "ip" : this.ip
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
