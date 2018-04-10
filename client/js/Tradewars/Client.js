(function($) {
    $.extend(true, window, {
        Tradewars : {
            Client : {
                model : new Backbone.Model(),
                
                initialize : function() {
                    _.extend(this, Backbone.Events);
                    console.log("Tradewars.Client initialized");
                },
                
                connect : function(callback) {
                    this._socket = io.connect();
                    var self=this;
                    this._socket.on("connect", function(socket) {
                        console.log("Tradewars.Client connected");
                        self.trigger("connected");
                    });
                    this._socket.on("disconnect", function(socket) {
                        console.log("Tradewars.Client disconnected");
                        self.trigger("disconnected");
                    });
                    this._socket.on("reconnect", function(socket) {
                        console.log("Tradewars.Client reconected");
                        self.trigger("reconnected");
                    });
                },
                
                accountcreate : function(credentials, callback) {
                    this._socket.emit("accountcreate", credentials, callback);
                },
                
                accountlogin : function(credentials, callback) {
                    this._socket.emit("accountlogin", credentials, callback);
                }
            }
        }
    })
})(jQuery);