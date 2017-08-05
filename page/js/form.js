/*global validPins*/
/*global loadValuesToDropDownMenus*/
/*global $*/
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

function loadValuesToDropDownMenus(){
    for (var i = 0 ; i < 24; i++){
        $(".timeHour").append("<option>"+i+"</option>");
    }
    for (var i = 0 ; i < 60; i++){
        $(".timeMinute").append("<option>"+i+"</option>");
        $(".timeSecond").append("<option>"+i+"</option>");
    }
    loadDevicesAjax(function(data){
        for (var i = 0 ; i < data.length; i++){
            $(".selectDevice").append("<option>"+data[i].name+ " [" +data[i]._id+ "]</option>");
        }
    });
}
function showForm(){
     $(".form").show();
}
function hideForm(){
     $(".form").hide();
}
function getDeviceFromButton(buttonElement,callback){
    var name = $(this).parent().parent().find(".deviceName").html();
    var deviceId = $(this).parent().parent().find(".deviceId").html();
    return callback(name,deviceId);
}

function getValueFromDeviceForm(callback){
    var name = $(".inputName").val();
    var deviceId = $(".inputDeviceId").val();
    return callback(name,deviceId);
}
function setValueToDeviceForm(name,deviceId){
    $(".inputName").val(name);
    $(".inputDeviceId").val(deviceId);
}

function getValueFromTimeStampForm(callback){
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
function exitForm(callback){
    $('body').on('click', '.exitBtn', function(){
        hideForm();
        return callback();
    });
}

