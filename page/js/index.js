let page = "";
//only used for getting date but not writing data
let globalTimeStamp = new TimeStamp();
let globalDevice = new Device();


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
function init(){
    Form.hideForm();
    //hover animaitons in the menu
    $("li").mouseover(function(){
        $(this).css("color","rgb(195, 51, 108)");
        }).mouseout(function(){
        $(this).css("color","#CCC");
    });
}


$(document).ready(function() {

    init();
    //neccesery for DeviceUpdate;
    let id = ""; //!!!!!!very important

    //to reload the old page
    let lastOpendPage = localStorage.getItem("page");
    if (lastOpendPage != null){
        if (lastOpendPage == "device"){
            loadDevicePage();
        }
        else if(lastOpendPage == "timeStamp"){
            loadTimeStampPage();
        }
        else if (lastOpendPage == "home"){
            loadHomePage();
        }
    }else{
        //no page state in local storage thats why hompage should be displayed
        loadHomePage();
    }

    //menu buttons
    $(".manageDevice").click(function(){
        loadDevicePage();
    })
    $(".manageTimeStamps").click(function(){
        loadTimeStampPage();
    })
    $(".home").click(function(){
        loadHomePage();
    });







    //TODO structure code like it is in frotnend
    //TODO all DOM for device IO
    //TODO all DOM for device management
    //TODO all DOM for timestamp management
    //----------------

    //to change the state of the devices shown on the startpage

    $('body').on('click', '.swtichButton', function(){
        let pin = $(this).attr('class').split(" ")[0];
        let device = new Device("",pin);
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
        Form.displayform("add",page,function(){});
        console.log("add");
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

    //TODO make two different methods

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
