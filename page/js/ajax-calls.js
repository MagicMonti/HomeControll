/*global $*/

function changeDeviceStateAjax(deviceId,str,callback){
    $.ajax({
        type: "GET",
        url: "/device/"+deviceId+"/"+str,
        processData: false,
        contentType: 'application/json'
    }).success(function(data){
        callback(data);
    });
}

function removeDeviceAjax(id, callback){
    $.ajax({
        type: "DELETE",
        url: "/device/"+id,
        processData: false,
        contentType: 'application/json'
    }).success(function(data){
        callback(data);
    });
}
function removeTimeStampAjax(idOfDevice,idOfTimeStamp, callback){
    $.ajax({
        type: "DELETE",
        url: "/timeStamp/"+idOfDevice+"/"+idOfTimeStamp,
        processData: false,
        contentType: 'application/json'
    }).success(function(data){
        callback(data);
    });
}
function updateDeviceAjax(name, deviceId, id, callback){
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
function addDeviceAjax(name,deviceId,callback){
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
function addTimeStampAjax(time,deviceState,repetition,idOfDevice,timeStampState,callback){
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

function loadDevicesAjax(callback){
    $.get( "/device", function( data ) {
        callback(data);
    });
}

function getUpdateRequest(callback){
    $.ajax({
        type: "GET",
        url: "/lastLog",
        processData: false,
        contentType: 'application/json'
    }).success(function(data){
        callback(data);
    });
}
