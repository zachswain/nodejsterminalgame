(function($) {
    $.extend(true, window, {
        Tradewars : {
            _socket : null,
            
            model : new Backbone.Model({
                state : Tradewars.State.Uninitialized
            }),
            
            _terminal : null,
            
            _handlers : [],
           
            run : function() {
                if( !this.isState(Tradewars.State.Uninitialized) ) {
                    console.log("Tradewars already running");
                    return;
                } else {
                    console.log("Tradewars initializing");
                }
                
                this.initialize();
                
                // Grab cookies, check user + session token
                
                console.log("Tradewars running");
            },
            
            initialize : function() {
                var self=this;
                
                _.extend(this, Backbone.Events);
                
                this.listenTo(this, "loggedIn", this.onLogin);
                
                this.listenTo(this.model, "change:state", this.onStateChange);
                
                Tradewars.Client.initialize();
                this.listenTo(Tradewars.Client, "connected", this.onConnected);
                this.listenTo(Tradewars.Client, "disconnected", this.onDisconnected);
                
                this._terminal = $("#terminal").terminal(function(command) {
                    console.log("command: " + command);
                    if( self._handlers.length>0 ) {
                        self._handlers[self._handlers.length-1].handleCommand(command);
                    }
                }, { 
                    greetings: 'Tradewars Interpreter',
                    name: 'js_demo',
                    height: 200,
                    prompt: 'js> '
                });
                
                Tradewars.Handlers.initialize({
                    terminal : this._terminal
                });
                
                this.setState(Tradewars.State.Initialized);
            },
            
            setState : function(newState) {
                console.log("Tradewars state changing to " + newState);
                this.model.set("state", newState);
            },
            
            isState : function(state) {
                return this.model.get("state") === state;
            },
            
            onStateChange : function(e, newState) {
                if( newState===Tradewars.State.Initialized ) {
                    Tradewars.Client.connect();
                    return;
                }
            },
            
            onConnected : function(e) {
                // Initialized -> Connected
                if( this.isState(Tradewars.State.Initialized) ) {
                    this.setState(Tradewars.State.Connected);
                    this.addHandler(Tradewars.Handler.WelcomeHandler);
                }
            },
            
            onDisconnected : function(e) {
                
            },
            
            onReconnected : function(e) {
                
            },
            
            addHandler : function(handler) {
                if( this._handlers.length>0 ) {
                    //this.stopListening(this._handlers[this._handlers.length-1]);
                }
                
                this._handlers.push(handler);
                
                this.listenTo(handler, "display", this.onDisplay);
                this.listenTo(handler, "stop", this.onStop); 
                handler.start();
            },
            
            removeHandler : function(handler) {
                this.stopListening(handler);
                console.log("removing handler");
                for( var i in this._handlers ) {
                    if( this._handlers[i]===handler ) {
                        this._handlers.splice(i, 1);
                        console.log("handler removed");
                        break;
                    }
                }
            },

            onDisplay : function(o) {
                console.log(o.message);
                this._terminal.echo(o.message);
            },
            
            onLogin : function(e) {
                console.log("Tradewars onLogin");
            },
            
            onStop : function(handler) {
                this.removeHandler(handler);
            }
        } 
    });
})(jQuery);