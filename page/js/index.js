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
    /*menuDeviceButton : $(".manageDevice"),
    menuTimeStampButton :  $(".manageTimeStamps"),
    menuHomeButton : $(".home"),
    addButton : $(".add")*/
    
};

let Device = {
    isPinValid : function(pin,callback){
        for (var i = 0 ; i < validPins.length ; i++){
            if (pin == validPins[i]){  
                return callback(true);
            }
            else if (i == validPins.length-1){
                return callback(false);
            }
        }
    },
    addDevice : function(){
        getValueFromDeviceForm(function(name, deviceId){
            Device.isPinValid(deviceId,function(isPinValid){
                if (isPinValid){
                    Ajax.addDevice(name,deviceId,function(data){
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
            });
        });
    },
    updateDevice : function(idOfDevice){
        getValueFromDeviceForm(function(name, deviceId){
            Device.isPinValid(deviceId,function(isPinValid){
                if (isPinValid){
                    Ajax.updateDevice(name,deviceId,idOfDevice,function(data){
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
            });
        });
    },
    removeDevice : function(idOfDevice){
        Ajax.removeDevice(idOfDevice, function(data){
            Ajax.loadDevices(function(data){
                Render.loadManageDevicePage(data);
                Ajax.getUpdateRequest(function(log){
                    document.cookie = "lastlog="+log+";";
                }); 
            });
        }) 
    }
}

let TimeStamp = {
    addTimeStamp : function(){
        getValueFromTimeStampForm(function(time,deviceState,repetition,idOfDevice,timeStampState){
            Ajax.addTimeStamp(time,deviceState,repetition,idOfDevice,timeStampState,function(data){
                Ajax.loadDevices(function(data){
                    Render.loadManageTimeStampPage(data);
                    console.log("timeStamp has been added");
                    Ajax.getUpdateRequest(function(log){
                        document.cookie = "lastlog="+log+";";
                    }); 
                });
            });
        });
    },
    removeTimeStamp : function(idOfDevice,idOfTimeStamp){
        Ajax.removeTimeStamp(idOfDevice,idOfTimeStamp, function() {
            Ajax.loadDevices(function(data){
                Render.loadManageTimeStampPage(data);
                Ajax.getUpdateRequest(function(log){
                    document.cookie = "lastlog="+log+";";
                }); 
            })
        })
    },
    updateTimeStamp : function(){
        
    },
    getTimeStamp : function(idOfTimeStamp,callback){
        Ajax.loadDevices(function(data){
            for (var i = 0 ; i < data.length ; i++){
                for (var j = 0 ; j < data[i].timeStamp.length ; j++){
                    if (data[i].timeStamp[j]._id == idOfTimeStamp){
                        return callback(data[i].timeStamp[j]);
                    }
                }
            }
        });
    },
    changeTimeStampState : function(idOfDevice, idOfTimeStamp){
        this.getTimeStamp(idOfTimeStamp,function(timeStamp){
            if(timeStamp != undefined){
                var timeStampState = "";
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
                    
                });   
            }
        })
        
    }
}

let Render = {
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
        var head = "<table class='table'>"+
            "<tbody>";
        var str = head;
        for (var i = 0 ; i < data.length ; i++){
            for (var j = 0; j < data[i].timeStamp.length; j++){
                var isChecked = "";
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
    
    
    
    //adds Device or TimeStamp to database
    $('body').on('click', '.addBtn', function(){
        hideForm();
        if (page == "device"){
            Device.addDevice();  
        }
        else if(page == "timeStamp"){
            TimeStamp.addTimeStamp()
        }
    });
    
     $('body').on('click', '.updateBtn', function(){
        hideForm();
        if (page == "device"){
            Device.updateDevice(id);
        }
        if (page == "timeStamp"){
            //Not implemented
        }
    })
    
    //updating timeStamp
    //changing the timeStampState activat/deactivate
    $('body').on('click', '.timeStampSwitch', function(){
        var idOfDevice = $(this).parent().parent().attr("class").split(" ")[0];
        var idOfTimeStamp = $(this).parent().parent().attr("class").split(" ")[1];
        TimeStamp.changeTimeStampState(idOfDevice,idOfTimeStamp);
    });

    
   

    //--------------
   
    //opens the form and loads the Device-data
    $('body').on('click', '.updateDevice', function(){
        displayform("update", page ,function(){});
        id = $(this).attr('class').split(" ")[0]; //neccesery for update event
        var name = $(this).parent().parent().find(".deviceName").html();
        var deviceId = $(this).parent().parent().find(".deviceId").html();
        //TODO set this funcitons to an object
        setValueToDeviceForm(name,deviceId);
    });


    $('body').on('click', '.removeDevice', function(){
        var idOfDevice = $(this).attr('class').split(" ")[0];
        Device.removeDevice(idOfDevice);
    });

    
    $('body').on('click', '.removeTimeStamp', function(){
        var idOfDevice = $(this).attr('class').split(" ")[0];
        var idOfTimeStamp =$(this).attr('class').split(" ")[1];
        TimeStamp.removeTimeStamp(idOfDevice,idOfTimeStamp);
        
    });
    $('body').on('click', '.swtichButton', function(){
        var deviceId = $(this).attr('class').split(" ")[0];
        if($(this).is(':checked')) {
            $(this).prop("checked",true);
            Ajax.changeDeviceState(deviceId,"on",function(){})
        }
        else{
            $(this).prop("checked",false);
            Ajax.changeDeviceState(deviceId,"off",function(){})
        }
    });

});


function getCookie() {
    var c = document.cookie;
    var cookie = c.split("=")[1];
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
