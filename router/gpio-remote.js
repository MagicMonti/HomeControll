let gpio = {};


gpio.open = function(device,type,callback){
    //TODO send to ESP8266
    callback();
}
gpio.write = function(device, state, callback){
    callback();
}
gpio.read = function(device,callback){
    callback(false,1);
}


module.exports = gpio;
