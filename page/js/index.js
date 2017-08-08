/*global $*/
/*global loadDevicesAjax*/
/*global addDevice*/
/*global updateDevice*/
/*global removeDevice*/

/*global displayform*/
/*global setValueToDeviceForm*/
/*global showForm*/
/*global hideForm*/
/*global removeTimeStamp*/
/*global exitForm*/
/*global removeDeviceClickEvent*/
/*global changeDeviceState*/
/*global addDeviceAjax*/

let page = "";
const validPins = [3,5,7,8,11,12,13,15,16,18,19,21,22,23,24,26,27,28,29,31,32,33,34,35,36,37,38,40];


let App = {
    init : function(){
        hideForm();
        Ajax.loadDevices(function(data){
            Render.displayDevicesToStartPage(data);
        });
        this.saveLastLog();
        this.animaitons();
    },
    saveLastLog : function(){
        if (getCookie() == ""){
            Render.getUpdateRequest(function(log){
                document.cookie = "lastlog="+log+";";
            });
        }
    },
    animaitons: function(){
        $("li").mouseover(function(){
            $(this).css("color","rgb(195, 51, 108)");
            }).mouseout(function(){
            $(this).css("color","#CCC");
        });
    }
};

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

let Render = {
    //TODO change deviceIp to pin;
    displayDevicesToStartPage : function(data){
        $(".add").hide();
        $("h1").html("Your devices");
        var str = "";
        for (var i = 0 ; i < data.length ; i++){
            var isChecked = "";
            if (data[i].state == "on"){
                isChecked = "checked";
            }
            str = str + "<div class='"+data[i]._id+" device'>" +
                "<span class='labelSwitch'>"+ data[i].name +"</span>" +
                "<span class='switchWrapper'>"+
                    "<label class='switch'>"+
                        "<input class='"+data[i].deviceId+ " swtichButton' type='checkbox' "+isChecked+">"+
                        "<span class='slider round'></span>"+
                    "</label>"+
                "</span>"+
                "<br>"+
            "</div>";

            if (i == data.length-1){
                $(".devices").html(str);
                console.log("displaying all devices")
            }
        }

    },
    //TODO change deviceIp to pin;
    loadManageDevicePage : function(data){
        $(".add").show();
        $("h1").html("Manage Devices");

        var head = "<table class='table'>"+
            "<tbody>";
        var str = head;
        for (var i = 0 ; i < data.length; i++){
            str = str + "<tr>"+
                "<td class='nameOfDevice'><div class='deviceName'>"+data[i].name+
                    "</div>"+
                    "<div class='deviceId'>"+data[i].deviceId+"</div>"+
                "</td>"+
                "<td><span class='"+data[i]._id +" updateDevice glyphicon glyphicon-pencil'></span></td>"+
                "<td><span class='"+data[i]._id +" removeDevice glyphicon glyphicon-remove'></span></td>"+
            "</tr>";
            $(".devices").html(str);
            if (i == data.length-1){
                $(".devices").html(str + "</tbody></table>");
            }
        }
    },
    loadManageTimeStampPage : function(data){
        $(".add").show();
        $("h1").html("Manage TimeStamps");
        $(".devices").html("");
        let head = "<table class='table'>"+
            "<tbody>";
        let str = head;
        for (var i = 0 ; i < data.length ; i++){
            for (let j = 0; j < data[i].timeStamp.length; j++){
                let isChecked = "";
                if (data[i].timeStamp[j].timeStampState == "on"){
                    isChecked = "checked";
                }
                str = str + "<tr>"+
                    "<td>"+
                        "<h4><strong class='timeStampTime'>"+data[i].timeStamp[j].time+"</strong><span class ='deviceName'> "+data[i].name+"</span></h4><br>"+
                        "<h5 class='deviceState'>"+data[i].timeStamp[j].deviceState+"</h5>"+
                        "<h6 class='repetition'>"+Render.stringConverter(data[i].timeStamp[j].repetition)+"</h6>"+
                    "</td>"+
                    "<td>"+
                        "<span class='"+data[i]._id + " " +data[i].timeStamp[j]._id+ " switchWrapper'>"+
                            "<label class='switch'>"+
                                "<input class='timeStampSwitch' type='checkbox' "+isChecked+">"+
                                "<span class='slider round'></span>"+
                            "</label>"+
                        "</span>"+
                    "</td>"+
                    "<td><span class='"+data[i]._id + " " +data[i].timeStamp[j]._id+" removeTimeStamp glyphicon glyphicon-remove'></span></td>"+
                "</tr>";
                $(".devices").html(str);
            }
            if (i == data.length-1){
                $(".devices").html(str + "</tbody></table>");
            }
        }

    },
    stringConverter: function(str){
        str = str.replace("1","MON");
        str = str.replace("2","TUE");
        str = str.replace("3","WED");
        str = str.replace("4","THU");
        str = str.replace("5","FRI");
        str = str.replace("6","SAT");
        str = str.replace("7","SUN");
        return str;
    }
}



$( document ).ready(function() {

    //init
    App.init();
    //neccesery for DeviceUpdate;
    let id = "";


    //menu buttons
    $(".manageDevice").click(function(){
        hideForm();
        Ajax.loadDevices(function(data){
            Render.loadManageDevicePage(data);
            page = "device";
        });
    })
    $(".manageTimeStamps").click(function(){
        hideForm();
        Ajax.loadDevices(function(data){
            Render.loadManageTimeStampPage(data);
            page = "timeStamp";
        });
    })
    $(".home").click(function(){
        hideForm();
        Ajax.loadDevices(function(data){
            Render.displayDevicesToStartPage(data);
            page = "home";
        });
    });
    //----------------

    //to change the state of the devices shown on the startpage

    $('body').on('click', '.swtichButton', function(){
        let pin = $(this).attr('class').split(" ")[0];
        if($(this).is(':checked')) {
            $(this).prop("checked",true);
            Ajax.changeDeviceState(pin,"on",function(){})
        }
        else{
            $(this).prop("checked",false);
            Ajax.changeDeviceState(pin,"off",function(){})
        }
    });

    //___________


    //Button left top corner
    //opens the Form
    $(".add").click(function(){
        showForm();
        displayform("add",page,function(){});
    });
    //Click events of buttons in the form
    //coloses the Form
    exitForm(function(){
       console.log("the form has been closed");
    })

    //only shows the data in the form which device was clicked on in the table
    $('body').on('click', '.updateDevice', function(){
        displayform("update", page ,function(){});
        id = $(this).attr('class').split(" ")[0]; //neccesery for update event
        var name = $(this).parent().parent().find(".deviceName").html();
        var pin = $(this).parent().parent().find(".deviceId").html();
        //TODO add this funcitons to an object
        //insert all values to from and displays it
        setValueToDeviceForm(name,pin);
    });

    //---------------------------

    //Database stuff

    //adds Device or TimeStamp to database
    $('body').on('click', '.addBtn', function(){
        hideForm();
        if (page == "device"){
            getValueFromDeviceForm(function(name, pin){
                let device = new Device(name,pin);
                device.addDevice();
            });
        }
        else if(page == "timeStamp"){
            getValueFromTimeStampForm(function(time,deviceState,repetition,idOfDevice,timeStampState){
                let timeStamp = new TimeStamp(time,deviceState,repetition,timeStampState);
                timeStamp.idOfDevice = idOfDevice;
                timeStamp.addTimeStamp();
            });
        }
    });

     $('body').on('click', '.updateBtn', function(){
        hideForm();
        if (page == "device"){
            getValueFromDeviceForm(function(name, pin){
                let device = new Device(name,pin);
                device.id = id; //global id ;
                device.updateDevice();
            });
        }
        if (page == "timeStamp"){
            //Not implemented
        }
    })

    //updating timeStamp
    //changing the timeStampState activat/deactivate
    $('body').on('click', '.timeStampSwitch', function(){
        let idOfDevice = $(this).parent().parent().attr("class").split(" ")[0];
        let idOfTimeStamp = $(this).parent().parent().attr("class").split(" ")[1];
        let timeStamp = new TimeStamp();
        timeStamp.idOfDevice = idOfDevice;
        timeStamp.idOfTimeStamp = idOfTimeStamp;
        timeStamp.changeTimeStampState();
    });

    $('body').on('click', '.removeDevice', function(){
        let idOfDevice = $(this).attr('class').split(" ")[0];
        let device = new Device();
        device.id = idOfDevice;
        device.removeDevice();
    });


    $('body').on('click', '.removeTimeStamp', function(){
        let idOfDevice = $(this).attr('class').split(" ")[0];
        let idOfTimeStamp =$(this).attr('class').split(" ")[1];
        let timeStamp = new TimeStamp();
        timeStamp.idOfTimeStamp = idOfTimeStamp;
        timeStamp.idOfDevice = idOfDevice;
        timeStamp.removeTimeStamp();

    });

});


function getCookie() {
    let c = document.cookie;
    let cookie = c.split("=")[1];
    return cookie;
}


setInterval(function () {
    Ajax.getUpdateRequest(function(log){
        if (log != getCookie()){
            if (page == "home"){
                Ajax.loadDevices(function(data){
                    Render.displayDevicesToStartPage(data);
                    document.cookie = "lastlog="+log+";";
                });
            }
        }
    });

},1500);
