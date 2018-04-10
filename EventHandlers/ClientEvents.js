var PasswordHash = require("password-hash");

var ClientEvents = function(app, client, socket) {
    this.app = app;
    this.client = client;
    this.socket = socket;
    
    this.handler = {
        "accountcreate" : AccountCreate.bind(this),
        "accountlogin" : AccountLogin.bind(this)
    }
}

function AccountCreate(credentials, callback) {
    console.log(this.client.id + " AccountCreate");
    
    if( !credentials.hasOwnProperty("name") ) {
        callback({
            success : false,
            message : "Name is a required value"
        });
    }
    
    if( !credentials.hasOwnProperty("password") ) {
        callback({
            success : false,
            message : "Password is a required field"
        });
    }
    
    if( this.app.storage.userExists({ name : credentials.name }) ) {
        callback({
            success : false,
            message : "Username already taken"
        });
    } else {
        if( this.app.storage.createUser(credentials.name, PasswordHash.generate(credentials.password)) ) {
            callback({
                success : true
            });
        } else {
            callback({
                success : false,
                message : "Could not create user"
            });
        }
    }
}

function AccountLogin(credentials, callback) {
    console.log(this.client.id + " AccountLogin " + JSON.stringify(credentials) );
    if( !credentials.hasOwnProperty("name") ) {
        callback({
            success : false,
            message : "Name is a required value"
        });
    }
    
    if( !credentials.hasOwnProperty("password") ) {
        callback({
            success : false,
            message : "Password is a required field"
        });
    }
    
    var user = this.app.storage.getUserByName(credentials.name);

    if( user !== undefined) {
        if( PasswordHash.verify(credentials.password, user.password) ) {
            callback({
                success : true,
                user : user
            });
        } else {
            callback({
                success : false,
                message : "Invalid password"
            });
        }
    } else {
        callback({
            success : false,
            message : "User '" + credentials.name + "' not found"
        });
    }
}

module.exports = ClientEvents;