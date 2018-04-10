var ClientEvents = require("./EventHandlers/ClientEvents");

var Client = function(app, socket) {
    this.app = app;
    this.socket = socket;
    this.id = this.socket.id;
    
    var eventHandlers = {
        client : new ClientEvents(app, this, socket)
    }
      
    for (var category in eventHandlers) {
        var handler = eventHandlers[category].handler;
        for (var event in handler) {
            socket.on(event, handler[event]);
        }
    }
    
    console.log("Client created");
}

module.exports = Client