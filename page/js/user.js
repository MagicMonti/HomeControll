var User = function(username,password){
    this.username = username;
    this.password = password;
    this.id = function(id){
        return id;
    };
    this.idOfDevices = function(idOfDevices){
        return idOfDevices;
    };
    this.getToken = function(callback){
        var data = {
             "username" : this.username,
             "password" : this.password
        };
        $.ajax({
            type: "POST",
            url: "/user/token",
            processData: false,
            contentType: 'application/json',
            data: JSON.stringify(data)
        }).success(function(data){
            callback(data.token);
        }).error(function(err){
            alert(JSON.stringify(err))
        });
    };
    this.getUser = function(callback){
        $.ajax({
            type: "GET",
            url: "/user/"+localStorage.getItem("token"),
            processData: false,
            contentType: 'application/json',
        }).success(function(user){
            callback(user);
        }).error(function(err){
            alert(JSON.stringify(err))
        });
    }
    this.getUsers = function(callback){
        $.ajax({
            type: "GET",
            url: "/user/users/"+localStorage.getItem("token"),
            processData: false,
            contentType: 'application/json',
        }).success(function(user){
            callback(user);
        }).error(function(err){
            alert(JSON.stringify(err))
        });
    },
    this.addUser = function(callback){
        var data = {
             username : this.username,
             password : this.password,
             idOfDevices : this.idOfDevices,
             rule : this.rule
        };
        $.ajax({
            type: "POST",
            url: "/user/"+localStorage.getItem("token"),
            processData: false,
            contentType: 'application/json',
            data: JSON.stringify(data)
        }).success(function(user){
            callback(user);
        }).error(function(err){
            alert(JSON.stringify(err))
        });
    }
}
