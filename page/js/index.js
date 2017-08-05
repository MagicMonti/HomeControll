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
var page = "";
const validPins = [3,5,7,8,11,12,13,15,16,18,19,21,22,23,24,26,27,28,29,31,32,33,34,35,36,37,38,40];

$( document ).ready(function() {
    if (getCookie() == ""){
        getUpdateRequest(function(log){
            document.cookie = "lastlog="+log+";";
        }); 
    }
    
    var id = "";
    //init
    hideForm();
    loadDevicesAjax(function(data){
        displayDevicesToStartPage(data);
    });

    $("li").mouseover(function(){
        $(this).css("color","rgb(195, 51, 108)");
    }).mouseout(function(){
        $(this).css("color","#CCC");
    });
    
    //menu buttons
    $(".manageDevice").click(function(){
        hideForm();
        loadDevicesAjax(function(data){
            loadManageDevicePage(data);
            page = "device";
        });
    })
    $(".manageTimeStamps").click(function(){
        hideForm();
        loadDevicesAjax(function(data){
            loadManageTimeStampPage(data);
            page = "timeStamp";
        });
    })
    $(".home").click(function(){
        hideForm();
        loadDevicesAjax(function(data){
            displayDevicesToStartPage(data);
             page = "home";
        });
    });
    //----------------
    
    //Button left top corner
    $(".add").click(function(){
        showForm();
        displayform("add",page,function(){});
    });
   
    //Click events of buttons in the form
    exitForm(function(){
       console.log("the form has been closed");
    })
    
    $('body').on('click', '.addBtn', function(){
        hideForm();
        if (page == "device"){
            getValueFromDeviceForm(function(name, deviceId){
                addDeviceAjax(name,deviceId,function(data){
                    loadDevicesAjax(function(data){
                        loadManageDevicePage(data);
                        console.log("device has been added");
                        getUpdateRequest(function(log){
                            document.cookie = "lastlog="+log+";";
                        }); 
                    });
                });
            });
        }
        else if(page == "timeStamp"){
            getValueFromTimeStampForm(function(time,deviceState,repetition,idOfDevice,timeStampState){
                addTimeStampAjax(time,deviceState,repetition,idOfDevice,timeStampState,function(data){
                    loadDevicesAjax(function(data){
                        loadManageTimeStampPage(data);
                        console.log("timeStamp has been added");
                        getUpdateRequest(function(log){
                            document.cookie = "lastlog="+log+";";
                        }); 
                    });
                });
            });
        }
    });
    
     $('body').on('click', '.updateBtn', function(){
        hideForm();
        if (page == "device"){
            getValueFromDeviceForm(function(name, deviceId){
                updateDeviceAjax(name,deviceId,id,function(data){
                    loadDevicesAjax(function(data){
                        loadManageDevicePage(data);
                        console.log("device has been updated");
                        getUpdateRequest(function(log){
                            document.cookie = "lastlog="+log+";";
                        }); 
                    });
                });
            });
        }
        if (page == "timeStamp"){
             getValueFromTimeStampForm(function(time,deviceState,repetition,idOfDevice,timeStampState){
                 //TODO
                getUpdateRequest(function(log){
                    document.cookie = "lastlog="+log+";";
                }); 
             });
        }
    })
    
    //updating timeStamp
    $('body').on('click', '.timeStampSwitch', function(){
        var idOfDevice = $(this).parent().parent().attr("class").split(" ")[0];
        var idOfTimeStamp = $(this).parent().parent().attr("class").split(" ")[1];
        loadDevicesAjax(function(data){
            for (var i = 0 ; i < data.length ; i++){
                for (var j = 0 ; j < data[i].timeStamp.length ; j++){
                    if (data[i].timeStamp[j]._id == idOfTimeStamp){
                        var timeStampState = "";
                        if (data[i].timeStamp[j].timeStampState == "off"){
                            timeStampState = "on";
                        }
                        else if (data[i].timeStamp[j].timeStampState == "on"){
                            timeStampState = "off";
                        }
                        var timeStamp = {
                            "time" :data[i].timeStamp[j].time,
                            "repetition" : data[i].timeStamp[j].repetition,
                            "deviceState" : data[i].timeStamp[j].deviceState,
                            "timeStampState" : timeStampState
                        }
                        updateTimeStamp(idOfDevice,idOfTimeStamp,timeStamp,function(datq){
                            
                        });
                        break;
                    }
                }
            }
        });
    });

    
   

    //--------------
   
    //events
    $('body').on('click', '.updateDevice', function(){
        displayform("update", page ,function(){});
        id = $(this).attr('class').split(" ")[0];
        var name = $(this).parent().parent().find(".deviceName").html();
        var deviceId = $(this).parent().parent().find(".deviceId").html();
        setValueToDeviceForm(name,deviceId);
    });


    $('body').on('click', '.removeDevice', function(){
        id = $(this).attr('class').split(" ")[0];
        removeDeviceAjax(id, function(data){
            loadDevicesAjax(function(data){
                loadManageDevicePage(data);
                getUpdateRequest(function(log){
                    document.cookie = "lastlog="+log+";";
                }); 
            });
        }) 
    });

    
    $('body').on('click', '.removeTimeStamp', function(){
        var idOfDevice = $(this).attr('class').split(" ")[0];
        var idOfTimeStamp =$(this).attr('class').split(" ")[1];
        removeTimeStampAjax(idOfDevice,idOfTimeStamp, function() {
            loadDevicesAjax(function(data){
                loadManageTimeStampPage(data);
                getUpdateRequest(function(log){
                    document.cookie = "lastlog="+log+";";
                }); 
            })
        })
    });
    $('body').on('click', '.swtichButton', function(){
        var deviceId = $(this).attr('class').split(" ")[0];
        if($(this).is(':checked')) {
            $(this).prop("checked",true);
            changeDeviceStateAjax(deviceId,"on",function(){

            })
        }
        else{
            $(this).prop("checked",false);
            changeDeviceStateAjax(deviceId,"off",function(){

            })
        }
    });

});

function displayDevicesToStartPage(data){
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
    
}
function loadManageDevicePage(data){
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
}
function loadManageTimeStampPage(data){
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
                    "<h6 class='repetition'>"+stringConverter(data[i].timeStamp[j].repetition)+"</h6>"+
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
    
}
function stringConverter(str){
    str = str.replace("1","MON");
    str = str.replace("2","TUE");
    str = str.replace("3","WED");
    str = str.replace("4","THU");
    str = str.replace("5","FRI");
    str = str.replace("6","SAT");
    str = str.replace("7","SUN");
    return str;
}

function getCookie() {
    var c = document.cookie;
    var cookie = c.split("=")[1];
    return cookie;
}
 
//update thread
var json = {};


setInterval(function () {
    getUpdateRequest(function(log){
        if (log != getCookie()){
            loadDevicesAjax(function(data){
                displayDevicesToStartPage(data);
                document.cookie = "lastlog="+log+";";
            }); 
        }
    });
    
},1500);
