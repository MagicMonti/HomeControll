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


function loadTimeStampPage(){
    Form.hideForm();
    Ajax.loadDevices(function(data){
        Render.loadManageTimeStampPage(data);
        page = "timeStamp";
        localStorage.setItem("page", page);
    });
}
function loadDevicePage(){
    Form.hideForm();
    Ajax.loadDevices(function(data){
        Render.loadManageDevicePage(data);
        page = "device";
        // Store
        localStorage.setItem("page", page);
    });
}
function loadHomePage(){
    Form.hideForm();
    Ajax.loadDevices(function(data){
        Render.displayDevicesToStartPage(data);
        page = "home";
        localStorage.setItem("page", page);
    });
}



$( document ).ready(function() {

    //init
    App.init();
    //neccesery for DeviceUpdate;
    let id = "";

    var lastOpendPage = localStorage.getItem("page");
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
        Form.showForm();
        Form.displayform("add",page,function(){});
    });
    //Click events of buttons in the form
    //coloses the Form
    Form.exitForm(function(){
       console.log("the form has been closed");
    })

    //only shows the data in the form which device was clicked on in the table
    $('body').on('click', '.updateDevice', function(){
        Form.displayform("update", page ,function(){});
        id = $(this).attr('class').split(" ")[0]; //neccesery for update event
        var name = $(this).parent().parent().find(".deviceName").html();
        var pin = $(this).parent().parent().find(".deviceId").html();
        //TODO add this funcitons to an object
        //insert all values to from and displays it
        Form.setValueToDeviceForm(name,pin);
    });

    //---------------------------

    //Database stuff

    //adds Device or TimeStamp to database
    $('body').on('click', '.addBtn', function(){
        Form.hideForm();
        if (page == "device"){
            Form.getValueFromDeviceForm(function(name, pin){
                let device = new Device(name,pin);
                device.addDevice();
            });
        }
        else if(page == "timeStamp"){
            Form.getValueFromTimeStampForm(function(time,deviceState,repetition,idOfDevice,timeStampState){
                let timeStamp = new TimeStamp(time,deviceState,repetition,timeStampState);
                timeStamp.idOfDevice = idOfDevice;
                timeStamp.addTimeStamp();
            });
        }
    });

     $('body').on('click', '.updateBtn', function(){
        Form.hideForm();
        if (page == "device"){
            Form.getValueFromDeviceForm(function(name, pin){
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
