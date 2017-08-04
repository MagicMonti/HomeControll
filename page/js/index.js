var page = "home";
var validPins = [3,5,7,8,10,11,12,13,15,16,18,19,21,22,23,24,26,27,28,29,31,32,33,34,35,36,37,38,40];

//html form 
function formHTML(method,page,callback){
    var classButton = ""
    var btnLable = ""
    var html = "";
    if (method == "add"){
        classButton = "addBtn";
        btnLable = "Add";
    }
    if (method == "update"){
        classButton = "updateBtn";
        btnLable = "Update";
    }
    if (page == "device"){
        html =  "<div class='input-group'>"+
                    "<span class='input-group-addon' id='basic-addon1'>Name</span>"+
                    "<input type='text' class='inputName form-control' aria-describedby='basic-addon1'>"+
                "</div><br>"+
                "<div class='input-group'>"+
                        "<span class='input-group-addon' id='basic-addon1'>DeviceId/PIN</span>"+
                        "<input type='text' class='inputDeviceId form-control' aria-describedby='basic-addon1'>"+
                "</div>"+
                "<div class='valid'>Valid Pins "+validPins+"</div>"+
                "<br>"+
                "<button type='button' class='btn "+classButton+"'>"+btnLable+"</button>"+
                "<button type='button' class='btn exitBtn'>Exit</button>"+
                "<br><br><hr>";
    }
    if (page == "timeStamp"){
        html =  "<label class='labelTimeStamp' for='sel2'>Time hr:min:sec</label>"+
                        "<select class='timeHour form-control' id='sel2'>"+
                        "</select>"+
                        "<select class='timeMinute form-control' id='sel2'>"+
                        "</select>"+
                        "<select class='timeSecond form-control' id='sel2'>"+
                        "</select><br><br><br>"+

                    "<label class='labelTimeStamp'>Device On/Off</label>"+
                    "<span class='switchDeviceState switchWrapper'>"+
                        "<label class='switch'>"+
                            "<input class='inputDeviceState' type='checkbox'>"+
                            "<span class='slider round'></span>"+
                        "</label>"+
                    "</span><br><br><br>"+

                    "<label>Repetition</label>"+
                    "<div class='checkbox'>"+
                      "<label><input class='MON' type='checkbox' value=''>Monday</label>"+
                    "</div>"+
                    "<div class='checkbox'>"+
                      "<label><input class='TUE' type='checkbox' value=''>Tuesday</label>"+
                    "</div>"+
                    "<div class='checkbox disabled'>"+
                      "<label><input class='WED' type='checkbox' value=''>Wednesday</label>"+
                    "</div>"+
                    "<div class='checkbox'>"+
                      "<label><input class='THU' type='checkbox' value=''>Thursday</label>"+
                    "</div>"+
                    "<div class='checkbox'>"+
                      "<label><input class='FRI' type='checkbox' value=''>Friday</label>"+
                    "</div>"+
                    "<div class='checkbox'>"+
                      "<label><input class='SAT' type='checkbox' value=''>Saturday</label>"+
                    "</div>"+
                    "<div class='checkbox'>"+
                      "<label><input class='SUN' type='checkbox' value=''>Sunday</label>"+
                    "</div><br><br>"+

                    "<label class='labelTimeStamp' for='sel2'>Select device</label>"+
                    "<select class='selectDevice form-control' id='sel2'>"+
                    "</select><br>"+

                    "<br><br>"+
                    "<label class='labelTimeStamp'>TimeStamp state</label>"+
                    "<span class='switchTimeStamp switchWrapper'>"+
                        "<label class='switch'>"+
                            "<input class='inputTimeStampState' type='checkbox' checked>"+
                            "<span class='slider round' ></span>"+
                        "</label>"+
                    "</span><br><br><br>"+


                    "<button type='button' class='btn "+classButton+"'>"+btnLable+"</button>"+
                    "<button type='button' class='btn exitBtn'>Exit</button>"+
                    "<br><br><hr>";
    }
    callback(html);
}
function initFormValues(){
    loadValuesToDropDownMenus();
    //checks the current day;
    var d = new Date();
    var n = d.getDay();
    if (n == 1){
        $('.MON').prop("checked",true);
    }
    if (n == 2){
        $('.TUE').prop("checked",true);
    }
    if (n == 3){
        $('.WED').prop("checked",true);
    }
    if (n == 4){
        $('.THU').prop("checked",true);
    }
    if (n == 5){
        $('.FRI').prop("checked",true);
    }
    if (n == 6){
        $('.SAT').prop("checked",true);
    }
    if (n == 7){
        $('.SUN').prop("checked",true);
    }
    $(".timeHour").val(d.getHours());
    $(".timeMinute").val(d.getMinutes());
    $(".timeSecond").val(d.getSeconds());
}
function displayform(method,page,callback){
    $(".form").show();
    formHTML(method,page,function(html){
        $(".form").html(html);
        initFormValues();
        callback(html);
    })
}


$( document ).ready(function() {
    var id = "";
    //init
    loadDevices(function(data){
        displayDevicesToStartPage(data);
    });
    $(".form").hide();

    $("li").mouseover(function(){
        $(this).css("color","rgb(195, 51, 108)");
    }).mouseout(function(){
        $(this).css("color","#CCC");
    });
    
    $(".manageDevice").click(function(){
        $(".form").hide();
        loadManageDevicePage();
        page = "device";
        
    })
    $(".manageTimeStamps").click(function(){
        $(".form").hide();
        loadManageTimeStampPage();
        page = "timeStamp";
    })
    $(".home").click(function(){
        $(".form").hide();
        loadDevices(function(data){
            displayDevicesToStartPage(data);
        });
        page = "home";
    });
    $(".add").click(function(){
        $(".form").show();
        displayform("add",page,function(){});
    });
    $('body').on('click', '.exitBtn', function(){
        $(".form").hide();
    });
    $('body').on('click', '.addBtn', function(){
        $(".form").hide();
        if (page == "device"){
            var name = $(".inputName").val();
            var deviceId = $(".inputDeviceId").val();
            //TODO list of valid pins
           /* if (validPins.indexOf(deviceId) < 0){
                console.log(validPins.indexOf(deviceId));
                alert("your "+deviceId+" pin is not valid");
            }*/
           // else{
                addDevice(name,deviceId,function(data){
                    loadManageDevicePage();
                });
            //}
        }
        if (page == "timeStamp"){
            getValueFromForm(function(time,deviceState,repetition,idOfDevice,timeStampState){
                addTimeStamp(time,deviceState,repetition,idOfDevice,timeStampState,function(data){
                    loadManageTimeStampPage();
                });
            })
        }
    });
    $('body').on('click', '.updateBtn', function(){
        $(".form").hide();
        if (page = "device"){
            var name = $(".inputName").val();
            var deviceId = $(".inputDeviceId").val();
            console.log(validPins)
           /* if (validPins.indexOf(deviceId) < 0 ){
                console.log(validPins.indexOf(deviceId));
                alert("your "+deviceId+" pin is not valid");
            }*/
           // else{
                updateDevice(name,deviceId,id ,function(data){
                    loadManageDevicePage();
                });
          // }
            
        }
    });
    $('body').on('click', '.updateDevice', function(){
        displayform("update",page,function(){});
        id = $(this).attr('class').split(" ")[0];
        var name = $(this).parent().parent().find(".deviceName").html();
        var deviceId = $(this).parent().parent().find(".deviceId").html();
        $(".inputName").val(name);
        $(".inputDeviceId").val(deviceId);
    });
    $('body').on('click', '.removeDevice', function(){
        id = $(this).attr('class').split(" ")[0];
        removeDevice(id, function() {
            loadManageDevicePage();
        })
    });
    $('body').on('click', '.removeTimeStamp', function(){
        var idOfDevice = $(this).attr('class').split(" ")[0];
        var idOfTimeStamp =$(this).attr('class').split(" ")[1];
        removeTimeStamp(idOfDevice,idOfTimeStamp, function() {
            loadManageTimeStampPage();
        })
    });
    $('body').on('click', '.swtichButton', function(){
        var deviceId = $(this).attr('class').split(" ")[0];
        if($(this).is(':checked')) {
            $(this).prop("checked",true);
            changeDeviceState(deviceId,"on",function(){

            })
        }
        else{
            $(this).prop("checked",false);
            changeDeviceState(deviceId,"off",function(){

            })
        }
    });

});

function loadValuesToDropDownMenus(){
    for (var i = 0 ; i < 24; i++){
        $(".timeHour").append("<option>"+i+"</option>");
    }
    for (var i = 0 ; i < 60; i++){
        $(".timeMinute").append("<option>"+i+"</option>");
        $(".timeSecond").append("<option>"+i+"</option>");
    }
    loadDevices(function(data){
        for (var i = 0 ; i < data.length; i++){
            $(".selectDevice").append("<option>"+data[i].name+ " [" +data[i]._id+ "]</option>");
        }
    });
}
function getValueFromForm(callback){
    var hour = $(".timeHour").val();
    var minute = $(".timeMinute").val();
    var second = $(".timeSecond").val();
    var time = hour + ":" + minute + ":" + second;
    var deviceState = "";
    if($(".inputDeviceState").is(':checked')) {
        $(this).prop("checked",true);
        deviceState = "on";
    }
    else{
        $(this).prop("checked",false);
        deviceState = "off";
    }
    var repetition = "";
    if ($('.MON').is(':checked')) {
        repetition += 1 + ",";
    }
    if ($('.TUE').is(':checked')) {
        repetition += 2 + ",";
    }
    if ($('.WED').is(':checked')) {
        repetition += 3 + ",";
    }
    if ($('.THU').is(':checked')) {
        repetition += 4 + ",";
    }
    if ($('.FRI').is(':checked')) {
        repetition += 5 + ",";
    }
    if ($('.SAT').is(':checked')) {
        repetition += 6 + ",";
    }
    if ($('.SUN').is(':checked')) {
        repetition += 7 + ",";
    }
    var str = $(".selectDevice").val();
    var idOfDevice =str.substring(str.lastIndexOf("[")+1,str.lastIndexOf("]"));

    var timeStampState = "";
    if($(".inputTimeStampState").is(':checked')) {
        $(this).prop("checked",true);
        timeStampState = "on";
    }
    else{
        $(this).prop("checked",false);
        timeStampState = "off";
    }

    callback(time,deviceState,repetition,idOfDevice,timeStampState);
}
//ajax calls
function changeDeviceState(deviceId,str,callback){
    $.ajax({
        type: "GET",
        url: "/device/"+deviceId+"/"+str,
        processData: false,
        contentType: 'application/json',
        success: function(r) {
            callback(r);
        }
    });
}
function removeDevice(id, callback){
    $.ajax({
        type: "DELETE",
        url: "/device/"+id,
        processData: false,
        contentType: 'application/json',
        success: function(r) {
            callback(r);
        }
    });
}
function removeTimeStamp(idOfDevice,idOfTimeStamp, callback){
    $.ajax({
        type: "DELETE",
        url: "/timeStamp/"+idOfDevice+"/"+idOfTimeStamp,
        processData: false,
        contentType: 'application/json',
        success: function(r) {
            callback(r);
        }
    });
}
function updateDevice(name, deviceId, id, callback){
    var data = {
         "name" : name,
         "deviceId" : deviceId
    };
    $.ajax({
        type: "PUT",
        url: "/device/"+id,
        processData: false,
        contentType: 'application/json',
        data: JSON.stringify(data),
        success: function(r) {
            callback(r);
        }
    });
}
function addDevice(name,deviceId,callback){
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
        success: function(r) {
            callback(r);
        }
    });
}
function loadDevices(callback){
    $.get( "/device", function( data ) {
        callback(data);
    });
}
//----end ajax calls

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
    }
    if (i = data.length-1){
        $(".devices").html(str);
    }
    
}
function loadManageDevicePage(){
    $(".add").show();
    $("h1").html("Manage Devices");
    loadDevices(function(data){
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
    })

}
function loadManageTimeStampPage(){
    $(".add").show();
    $("h1").html("Manage TimeStamps");
    $(".devices").html("");
    loadDevices(function(data){
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
                                "<input type='checkbox' "+isChecked+">"+
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
    });
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
function addTimeStamp(time,deviceState,repetition,idOfDevice,timeStampState,callback){
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
        success: function(r) {
            callback(r);
        }
    });
}
function updateTimeStamp(){
    
}

var json = {};
setInterval(function () {
    loadDevices(function(data){
        //compareJSON(json, data);
        if (JSON.stringify(json) != JSON.stringify(data)){
			if (page == "home"){
				displayDevicesToStartPage(data);
				json = data;
			}	
        }
    });
},1500);
