let gpio = {};

gpio.open = function(id,type,callback){
    callback();
}
gpio.write = function(id, state, callback){
    callback();
}
gpio.read = function(id,callback){
    callback(false,1);
}


module.exports = gpio;
