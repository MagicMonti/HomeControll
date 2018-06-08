let Form = {
    formHTML : function(method,page,callback){
        let classButton = ""
        let btnLable = ""
        let html = "";
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
                            "<span class='input-group-addon' id='basic-addon1'>PIN</span>"+
                            "<input type='text' class='inputPin form-control' aria-describedby='basic-addon1'>"+
                    "</div><br>"+
                    "<div class='input-group'>"+
                            "<span class='input-group-addon' id='basic-addon1'>IP</span>"+
                            "<input type='text' class='inputIp form-control' aria-describedby='basic-addon1'>"+
                    "</div>"+
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
                          "<label><input class='ALL' type='checkbox' value=''>All</label>"+
                        "</div>"+
                        "<div class='checkbox'>"+
                          "<label><input class='WKDAY' type='checkbox' value=''>Weekdays</label>"+
                        "</div>"+
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
        if (page == "users"){
            html =  "<div class='input-group'>"+
                        "<span class='input-group-addon' id='basic-addon1'>username</span>"+
                        "<input type='text' class='username form-control' aria-describedby='basic-addon1'>"+
                    "</div><br>"+
                    "<div class='input-group'>"+
                            "<span class='input-group-addon' id='basic-addon1'>password</span>"+
                            "<input type='password' class='password_1 form-control' aria-describedby='basic-addon1' >"+
                    "</div>"+
                    "<br>"+
                    "<div class='input-group'>"+
                            "<span class='input-group-addon' id='basic-addon1'>password</span>"+
                            "<input type='password' class='password_2 form-control' aria-describedby='basic-addon1' >"+
                    "</div>"+
                    "<br>"+
                    "<label class='labelRule' for='sel2'>Rule</label>"+
                    "<select class='ruleSelect form-control' id='sel2'>"+
                        "<option>default</option>"+
                        "<option>admin</option>"+
                    "</select>"+
                    "<br>"+
                    "<label class='deviceLabel'>Devices</label>"+
                    "<div class='selectDevices'>"+
                        //devices
                    "</div>"+
                    "<br>"+
                    "<button type='button' class='btn addBtn'>Add</button>"+
                    "<button type='button' class='btn exitBtn'>Exit</button>"+
                    "<br><br><hr>";
        }
        callback(html);
    },

    initFormValues : function(){
        Form.loadValuesToDropDownMenus();
        Form.loadDeviceSelections();
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
    },
    displayform : function(method,page,callback){
        $(".form").show();
        Form.formHTML(method,page,function(html){
            $(".form").html(html);
            Form.initFormValues();
            callback(html);
        })
    },
    loadValuesToDropDownMenus : function(){
        for (var i = 0 ; i < 24; i++){
            $(".timeHour").append("<option>"+i+"</option>");
        }
        for (var i = 0 ; i < 60; i++){
            $(".timeMinute").append("<option>"+i+"</option>");
            $(".timeSecond").append("<option>"+i+"</option>");
        }
        //load Devices into dropdownmenu
        globalDevice.loadDevices(function(data){
            for (var i = 0 ; i < data.length; i++){
                $(".selectDevice").append("<option>"+data[i].name+ " [" +data[i]._id+ "]</option>");
            }
        });
    },
    loadDeviceSelections : function(){
        $(".deviceLabel").show();
        globalDevice.loadDevices(function(data){
            let str = ""
            for (var i = 0 ; i < data.length; i++){
                str = str + "<div class='checkbox'>"+
                  "<label><input class='"+data[i]._id+"' type='checkbox' value=''>"+data[i].name+ " [" +data[i]._id+ "]"+"</label></div>";
            }
            $(".selectDevices").append(str);
        });
    },
    clearDeviceSelections : function(){
            $(".selectDevices").html("");
    },
    showForm : function(){
        $(".form").show();
    },
    hideForm : function(){
        $(".form").hide();
    },
    getDeviceFromButton : function(element,callback){


        let name = element.parent().parent().find(".deviceName").html();
        let pin = element.parent().parent().find(".devicePin").html();
        let ip = element.parent().parent().find(".deviceIp").html();
        return callback(name,pin,ip);
    },
    getValueFromDeviceForm : function(callback){
        let name = $(".inputName").val();
        let pin = $(".inputPin").val();
        let ip = $(".inputIp").val();

        return callback(name,pin,ip);
    },
    changeRule : function(){
        if ($(".ruleSelect").val()=="default"){
            Form.loadDeviceSelections();
        }else{
            $(".deviceLabel").hide();
            Form.clearDeviceSelections();
        }
    },
    getValueFromLoginForm : function(callback){
        let username = $(".username").val();
        let password = $(".password").val();
        return callback(username,password);
    },
    setValueToDeviceForm : function(name,pin,ip){
        $(".inputName").val(name);
        $(".inputPin").val(pin);
        $(".inputIp").val(ip);
    },
    getValuesFromUserForm : function(callback){
        let username = $(".username").val();
        let password1 = $(".password_1").val();
        let password2 = $(".password_2").val();
        let rule = $(".ruleSelect").val();
        if (password1 != password2){
            console.log(password1,password2);
            return alert("incorrect password!");
        }
        idOfDevices = []
        globalDevice.loadDevices(function(data){
            for (var i = 0 ; i < data.length; i++){
                if ($('.'+data[i]._id).is(':checked')) {
                    idOfDevices.push(data[i]._id)
                }
            }
            let user = {
                username : username,
                password : password1,
                idOfDevices : idOfDevices,
                rule : rule
            }
            callback(user)
        });
    },
    getValueFromTimeStampForm : function(callback){
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
    },
    exitForm : function(callback){
        $('body').on('click', '.exitBtn', function(){
            Form.hideForm();
            return callback();
        });
    }

}
