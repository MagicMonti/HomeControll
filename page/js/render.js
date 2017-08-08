
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
