let App = {
    init : function(){
        Form.hideForm();
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
};
