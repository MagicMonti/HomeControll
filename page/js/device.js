let Device = function(name,pin){
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
    this.addDevice = function(){
        if (this.isPinValid){
            Ajax.addDevice(this.name,this.pin,function(data){
                Ajax.loadDevices(function(data){
                    Render.loadManageDevicePage(data);
                    console.log("device has been added");
                    Ajax.getUpdateRequest(function(log){
                        document.cookie = "lastlog="+log+";";
                    });
                });
            });
        }
        else{
            alert("This pin is not valid");
        }
    };
    this.updateDevice = function(){
        if (this.isPinValid){
            Ajax.updateDevice(this.name,this.pin,this.id,function(data){
                Ajax.loadDevices(function(data){
                    Render.loadManageDevicePage(data);
                    console.log("device has been updated");
                    Ajax.getUpdateRequest(function(log){
                        document.cookie = "lastlog="+log+";";
                    });
                });
            });
        }
        else{
            alert("This pin is not valid");
        }
    };
    this.removeDevice = function(){
        Ajax.removeDevice(this.id, function(data){
            Ajax.loadDevices(function(data){
                Render.loadManageDevicePage(data);
                Ajax.getUpdateRequest(function(log){
                    document.cookie = "lastlog="+log+";";
                });
            });
        })
    }
}
