/*global $*/

let Ajax = {
    
};

Ajax.changeDeviceState = function(deviceId,str,callback){
    $.ajax({
        type: "GET",
        url: "/device/"+deviceId+"/"+str,
        processData: false,
        contentType: 'application/json'
    }).success(function(data){
        callback(data);
    });
}

Ajax.removeDevice = function(id, callback){
    $.ajax({
        type: "DELETE",
        url: "/device/"+id,
        processData: false,
        contentType: 'application/json'
    }).success(function(data){
        callback(data);
    });
}
Ajax.removeTimeStamp = function(idOfDevice,idOfTimeStamp, callback){
    $.ajax({
        type: "DELETE",
        url: "/timeStamp/"+idOfDevice+"/"+idOfTimeStamp,
        processData: false,
        contentType: 'application/json'
    }).success(function(data){
        callback(data);
    });
}
Ajax.updateDevice = function(name, deviceId, id, callback){
    var data = {
         "name" : name,
         "deviceId" : deviceId
    };
    $.ajax({
        type: "PUT",
        url: "/device/"+id,
        processData: false,
        contentType: 'application/json',
        data: JSON.stringify(data)
    }).success(function(data){
        callback(data);
    });
}
Ajax.addDevice = function(name,deviceId,callback){
    var data = {
         "name" : name,
         "deviceId" : deviceId
    };
    $.ajax({
        type: "POST",
        url: "/device",
        processData: false,
        contentType: 'application/json',
        data: JSON.stringify(data),
    }).success(function(data){
        callback(data);
    });
}
Ajax.addTimeStamp = function(time,deviceState,repetition,idOfDevice,timeStampState,callback){
    var data = {
         "time" : time,
         "deviceState" : deviceState,
         "repetition" : repetition,
         "timeStampState" : timeStampState
    };
    $.ajax({
        type: "POST",
        url: "/timeStamp/"+idOfDevice,
        processData: false,
        contentType: 'application/json',
        data: JSON.stringify(data),
    }).success(function(data){
        callback(data);
    });
}

Ajax.loadDevices = function(callback){
    $.get( "/device", function( data ) {
        callback(data);
    });
}

Ajax.getUpdateRequest = function(callback){
    $.ajax({
        type: "GET",
        url: "/lastLog",
        processData: false,
        contentType: 'application/json'
    }).success(function(data){
        callback(data);
    });
}

Ajax.updateTimeStamp = function(idOfDevice,idOfTimeStamp,timeStamp,callback){
    $.ajax({
        type: "PUT",
        url: "/timeStamp/"+idOfDevice+"/"+idOfTimeStamp,
        processData: false,
        contentType: 'application/json',
        data: JSON.stringify(timeStamp),
    }).success(function(data){
        callback(data);
    });
}

