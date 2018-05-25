let Render = {
    //TODO change deviceIp to pin;
    displayDevicesToStartPage : function(data){
        $(".add").hide();
        $("h1").html("Your devices");
        var str = "";
        for (var i = 0 ; i < data.length ; i++){
            var isChecked = "";
            if (data[i].deviceState == "on"){
                isChecked = "checked";
            }
            str = str + "<div class='"+data[i]._id+" device'>" +
                "<span class='labelSwitch'>"+ data[i].name +"</span>" +
                "<span class='switchWrapper'>"+
                    "<label class='switch'>"+
                        "<input class='"+data[i]._id+ " swtichButton' type='checkbox' "+isChecked+">"+
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
    updateDevicesOnStartPage : function(data){

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

    //TODO use GET timestamps not GET devices
    loadManageTimeStampPage : function(timeStamps){
        $(".add").show();
        $("h1").html("Manage TimeStamps");
        $(".devices").html("");
        let head = "<table class='table'>"+
            "<tbody>";
        let str = head;
        //for (var i = 0 ; i < data.length ; i++){
            for (let j = 0; j < timeStamps.length; j++){
                let isChecked = "";
                if (timeStamps[j].timeStampState == "on"){
                    isChecked = "checked";
                }
                str = str + "<tr>"+
                    "<td>"+
                        "<h4><strong class='timeStampTime'>"+timeStamps[j].time+"</strong><span class ='deviceName'> "+timeStamps[j].name+"</span></h4><br>"+
                        "<h5 class='deviceState'>"+timeStamps[j].deviceState+"</h5>"+
                        "<h6 class='repetition'>"+Render.stringConverter(timeStamps[j].repetition)+"</h6>"+
                    "</td>"+
                    "<td>"+
                        "<span class='"+timeStamps[j].idOfDevice + " " +timeStamps[j]._id+ " switchWrapper'>"+
                            "<label class='switch'>"+
                                "<input class='timeStampSwitch' type='checkbox' "+isChecked+">"+
                                "<span class='slider round'></span>"+
                            "</label>"+
                        "</span>"+
                    "</td>"+
                    "<td><span class='"+timeStamps[j].idOfDevice + " " +timeStamps[j]._id+" removeTimeStamp glyphicon glyphicon-remove'></span></td>"+
                "</tr>";
                $(".devices").html(str);
                if (j == timeStamps.length-1){
                    $(".devices").html(str + "</tbody></table>");
                }
            }
    },
    stringConverter: function(str){
        if (str != null && str != undefined){
            str = str.replace("1","MON");
            str = str.replace("2","TUE");
            str = str.replace("3","WED");
            str = str.replace("4","THU");
            str = str.replace("5","FRI");
            str = str.replace("6","SAT");
            str = str.replace("7","SUN");
        }
        return str;
    },

    displayLogin : function(callback){
        $("h1").html("Login");
        $(".devices").html("<div class='input-group'>"+
            "<span class='input-group-addon' id='basic-addon1'>Username</span>"+
            "<input type='text' class='username form-control' aria-describedby='basic-addon1'>"+
        "</div></br>"+
        "<div class='input-group'>"+
            "<span class='input-group-addon' id='basic-addon1'>Password</span>"+
            "<input type='password' class='password form-control' aria-describedby='basic-addon1'>"+
        "</div></br>"+
        "<button type='button' class='btn loginbtn'>login</button>");
    },
    removeLogin : function(callback){
        $(".devices").html("");
        callback()
    },
    displayUsers : function(users, callback){
        $(".add").show();
        $("h1").html("Manage Users");
        let head = "<table class='table'>"+
            "<tbody>";
        let str = head;
        for (let i = 0 ; i < users.length; i++){
            str = str + "<tr>"+
                "<td><span class='"+users[i]._id +" username'>"+users[i].username+"</span></td>"+
                "<td><span class='"+users[i]._id +" rule'>"+users[i].rule+"</span></td>"+
                "<td><span class='"+users[i]._id +" updateUser glyphicon glyphicon-pencil'></span></td>"+
                "<td><span class='"+users[i]._id +" deleteUser glyphicon glyphicon-remove'></span></td>"+
            "</tr>";
            //$(".devices").html(str);
            if (i == users.length-1){
                $(".devices").html(str + "</tbody></table>");
            }
        }
    }
}
