let page = "";
//only used for getting data but not writing data
let globalTimeStamp = new TimeStamp();
let globalDevice = new Device();
let globalUser = new User();


function loadLoginPage(){
    Form.hideForm();
    page = "login"
    localStorage.setItem("login", page);
    Render.displayLogin();
}

//page is used when the website is reloaded it goes to the old session
function loadTimeStampPage(){
    Form.hideForm();
    globalTimeStamp.getTimeStamps(function(timeStamps){
        Render.loadManageTimeStampPage(timeStamps);
        page = "timeStamp";
        localStorage.setItem("page", page);
    })
    //TODO only load TimeStamps
}
function loadDevicePage(){
    Form.hideForm();
    //beacause only show
    globalDevice.loadDevices(function(data){
        Render.loadManageDevicePage(data);
        page = "device";
        // Store
        localStorage.setItem("page", page);
    });

}
function loadHomePage(){
    Form.hideForm();
    globalDevice.loadDevices(function(data){
        Render.displayDevicesToStartPage(data);
        page = "home";
        localStorage.setItem("page", page);
    });
}
function updateHomePage(){
    Form.hideForm();
    globalDevice.loadDevices(function(data){
        Render.updateDevicesOnStartPage(data);
        page = "home";
        localStorage.setItem("page", page);
    });
}
function loadUsersPage(){
    globalUser.getUsers(function(users){
        Render.displayUsers(users);
        page = "users";
        localStorage.setItem("page", page);
        console.log("servas");
    })
}


function init(){
    Form.hideForm();
    //hover animaitons in the menu
    $("li").mouseover(function(){
        $(this).css("color","rgb(195, 51, 108)");
        }).mouseout(function(){
        $(this).css("color","#CCC");
    });
}

function loadAdminParts(){
    $(".jk_menu").html('<li class="home">Home</li>'+
    '<li class="manageDevice">Manage Devices</li>'+
    '<li class="manageTimeStamps">Manage Timestamps</li>'+
    '<li class="manageUsers">Manage Users</li>'+
    '<li class="account">login</li>')
}
function loadDefaultParts(){
    $(".jk_menu").html('<li class="home">Home</li>'+
    '<li class="manageTimeStamps">Manage Timestamps</li>'+
    '<li class="account">login</li>')
}


$(document).ready(function() {

    init();
    //neccesery for DeviceUpdate;
    let id = ""; //!!!!!!very important

    //to reload the old page
    let lastOpendPage = localStorage.getItem("page");
    let token = localStorage.getItem("token");
    if (token != null && token != "" && token != undefined){
        globalUser.getUser(function(user){
            if (user.rule == "admin"){
                loadAdminParts();
            }
            if (!localStorage.getItem("idOfDevices")){
                localStorage.setItem("idOfDevice", user.idOfDevices)
            }
            $(".account").html(user.username  + " logout")
        })
        if (lastOpendPage != null){
            if (lastOpendPage == "device"){
                loadDevicePage();
            }else if(lastOpendPage == "timeStamp"){
                loadTimeStampPage();
            }else if (lastOpendPage == "home"){
                loadHomePage();
            }else if (lastOpendPage == "users"){
                loadUsersPage();
            }
        }else{
            //no page state in local storage thats why hompage should be displayed
            loadHomePage();
        }
    }
    else{
        loadLoginPage();
    }

    //menu buttons
    $('body').on('click', ".manageDevice", function(){
        loadDevicePage();
    })
    $('body').on('click', ".manageTimeStamps", function(){
        loadTimeStampPage();
    })
    $('body').on('click', ".home", function(){
        loadHomePage();
    });
    $('body').on('click', ".manageUsers", function(){
        loadUsersPage();
    });
    $('body').on('click', ".account", function(){
        let token = localStorage.getItem("token")
        if(token == null || token == undefined || token == ""){
            loadLoginPage();
        } else{
            localStorage.setItem("token", "");
            localStorage.setItem("idOfDevice", "") //clear idOfDevices
            loadDefaultParts()
            $(this).html("login")
            loadLoginPage()
            //TODO get user by token
        }
    })

    //TODO structure code like it is in frotnend
    //TODO all DOM for device IO
    //TODO all DOM for device management
    //TODO all DOM for timestamp management
    //----------------

    //to change the state of the devices shown on the startpage

    $('body').on('click', '.swtichButton', function(){
        let id = $(this).attr('class').split(" ")[0];
        let device = new Device();
        device.id = id
        if($(this).is(':checked')) {
            $(this).prop("checked",true);
            device.changeDeviceState("on",function(){})
        }
        else{
            $(this).prop("checked",false);
            device.changeDeviceState("off",function(){})
        }
    });

    //___________


    //Button left top corner with plus
    //opens the Form
    $(".add").click(function(){
        Form.showForm();
        //opens the from with "add" option there is also an "udate" option
        Form.displayform("add",page,function(){});
    });
    //Click events of buttons in the form
    //closes the Form
    Form.exitForm(function(){
       console.log("the form has been closed");
    })

    //only shows the data in the form which device was clicked on in the table
    $('body').on('click', '.updateDevice', function(){
        Form.displayform("update", page ,function(){});
        var name = $(this).parent().parent().find(".deviceName").html();
        var pin = $(this).parent().parent().find(".deviceId").html();

        id = $(this).attr('class').split(" ")[0];
        //TODO add this funcitons to an object
        //insert all values to from and displays it
        Form.setValueToDeviceForm(name,pin);
    });

    //---------------------------

    //Database stuff
    //faster repetition change

    function setWeekDays(state){
        $('.MON').prop("checked",state);
        $('.TUE').prop("checked",state);
        $('.WED').prop("checked",state);
        $('.THU').prop("checked",state);
        $('.FRI').prop("checked",state);
    }
    function setAllDays(state){
        setWeekDays(state);
        setWeekend(state);
    }
    function setWeekend(state){
        $('.SAT').prop("checked",state);
        $('.SUN').prop("checked",state);
    }

    $('body').on('click', '.ALL', function(){
        if ($('.ALL').is(':checked')) {
            setAllDays(true);
            $('.WKDAY').prop("checked",false);
        }else{
            setAllDays(false);
        }
    })
    $('body').on('click', '.WKDAY', function(){
        setWeekend(false)
        if ($('.WKDAY').is(':checked')) {
            setWeekDays(true);
            $('.ALL').prop("checked",false);
        }else{
            setWeekDays(false);
        }
    })

    //login
    $('body').on('click', '.loginbtn', function(){
        //TODO implement login
        Form.getValueFromLoginForm(function(username, password){
            let user = new User(username, password);
            user.getToken(function(token){
                localStorage.setItem("token", token);
                Render.removeLogin(function(){
                    user.getUser(function(user){
                        localStorage.setItem("idOfDevice", user.idOfDevices)
                        if (user.rule == "admin"){
                            loadAdminParts();
                        }
                        $(".account").html(user.username  + " logout")
                    })
                    loadHomePage()
                })

            });
        })
    });
    //adds Device or TimeStamp to database
    $('body').on('click', '.addBtn', function(){
        console.log(page);
        Form.hideForm();
        if (page == "device"){
            Form.getValueFromDeviceForm(function(name, pin){
                let device = new Device(name,pin);
                device.writeDeviceToDB(function(data){
                    loadDevicePage()
                });
            });
        }
        else if(page == "timeStamp"){
            Form.getValueFromTimeStampForm(function(time,deviceState,repetition,idOfDevice,timeStampState){
                let timeStamp = new TimeStamp(time,deviceState,repetition,timeStampState);
                timeStamp.idOfDevice = idOfDevice;
                timeStamp.writeTimeStampToDB(function(data){
                    loadTimeStampPage()
                });
            });
        }
        else if(page == "users"){
            Form.getValuesFromUserForm(function(_user){
                let user = new User();
                user.username = _user.username;
                user.password = _user.password;
                user.idOfDevices = _user.idOfDevices;
                user.addUser(function(data){
                    loadUsersPage();
                })
            })
        }
    });

     $('body').on('click', '.updateBtn', function(){
        Form.hideForm();
        if (page == "device"){
            Form.getValueFromDeviceForm(function(name, pin){
                let device = new Device(name,pin);
                device.id = id;
                device.updateDeviceInDB(function(data){
                    loadDevicePage()
                });
            });
        }
        if (page == "timeStamp"){
            //TODO Not implemented
        }
    })

    //updating timeStamp
    //changing the timeStampState activat/deactivate
    $('body').on('click', '.timeStampSwitch', function(){
        //let idOfDevice = $(this).parent().parent().attr("class").split(" ")[0];
        let idOfTimeStamp = $(this).parent().parent().attr("class").split(" ")[1];
        let timeStamp = new TimeStamp();
        //timeStamp.idOfDevice = idOfDevice;
        timeStamp.idOfTimeStamp = idOfTimeStamp;
        timeStamp.getTimeStampById(function(data){
            timeStamp.time = data.time;
            timeStamp.deviceState = data.deviceState;
            timeStamp.repetition = data.repetition;
            timeStamp.timeStampState = data.timeStampState;
            timeStamp.idOfDevice = data.idOfDevice;
            //not timeStamp = data ; because we need idOfTimeStamp and not _id and also overwrites functions
            timeStamp.changeTimeStampState(function(data){
                //Ajax.loadDevices(function(data){
                //    Render.loadManageTimeStampPage(data);
                    console.log("device has been updated");
                //});
            });
        })
    });

    $('body').on('click', '.removeDevice', function(){
        let idOfDevice = $(this).attr('class').split(" ")[0];
        let device = new Device();
        device.id = idOfDevice;
        device.removeDeviceFromDB(function(data){
            loadDevicePage()
        });
    });


    $('body').on('click', '.removeTimeStamp', function(){
        //let idOfDevice = $(this).attr('class').split(" ")[0];
        let idOfTimeStamp =$(this).attr('class').split(" ")[1];
        let timeStamp = new TimeStamp();
        timeStamp.idOfTimeStamp = idOfTimeStamp;
        //timeStamp.idOfDevice = idOfDevice;
        timeStamp.removeTimeStampFromDB(function(data){
            loadTimeStampPage()
        });
    });

});

function getCookie() {
    let c = document.cookie;
    let cookie = c.split("=")[1];
    return cookie;
}

function runWebSocket(){
    if ("WebSocket" in window){
        let ws = new WebSocket("ws://localhost:8000/update");
        let hash = "";
        let count = 0 ;
		ws.onmessage = function (evt){
            if (count == 0){
                hash = evt.data;
            }
            else if (count > 0 ){
                if (hash != evt.data){
                    if (page == "home"){
                        console.log("update");
                        loadHomePage();
                    }
                    hash = evt.data;
                }
            }
            count++;
        }
	    ws.onclose = function(){
            console.log("Connection is closed...");
        };
    }else{
       alert("WebSocket NOT supported by your Browser!");
    }
}

runWebSocket();
