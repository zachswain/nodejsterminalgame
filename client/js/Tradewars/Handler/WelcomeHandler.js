(function($) {
    $.extend(true, window, {
        Tradewars : {
            Handler : {
                WelcomeHandler : {
                    initialize : function(parameters) {
                        _.extend(this, Backbone.Events);
                        
                        this._terminal = parameters.terminal;
                        
                        console.log("Tradewars.Handler.WelcomeHandler initialized");   
                    },
                    
                    start : function() {
                        var self=this;
                        this.welcome();
                    },
                    
                    welcome : function() {
                        var self=this;
                        var history = this._terminal.history();
                        history.disable();
                        
                        this.display("Welcome to Tradewars");
                        this.display("Enter 'login <name> <password>' to login, or\n'create <name> <password>' to create a new account.")
                        
                        this._terminal.push(function(command) {
                            self._terminal.pop();
                            history.enable();
                            
                            if( (parameters=command.match(/^create ([a-zA-Z]+)\s?([\S]*)$/)) ) {
                                self._terminal.pause();
                              
                                var name = parameters[1];
                                var password = parameters[2];
                              
                                self.cmd_create(name, password)
                                    .done(function() {
                                        self.display("Account created");
                                        
                                        self.cmd_login(name, password)
                                            .done(function(results) {
                                                Tradewars.trigger("loggedIn", {
                                                    user : results.user
                                                });
                                                self._terminal.resume();
                                                self.stop();
                                                //self.welcome();
                                            })
                                            .fail(function() {
                                                self._terminal.resume();
                                                self.welcome();
                                            })
                                    })
                                    .fail(function() {
                                        self.display("Account could not be created");
                                        self._terminal.resume();
                                        self.welcome();
                                    })
                            } else if( (parameters=command.match(/^login ([a-zA-Z]+)\s?([\S]*)$/)) ) {
                                self._terminal.pause();
                                
                                var name = parameters[1];
                                var password = parameters[2];
                                
                                self.cmd_login(name, password)
                                    .done(function(results) {
                                        Tradewars.trigger("loggedIn", {
                                            user : results.user
                                        });
                                        self._terminal.resume();
                                        self.stop();
                                        // self.welcome();
                                    })
                                    .fail(function(results) {
                                        self.display("[[;#ff0000;#000000]Login failed: " + results.message + "]");
                                        self._terminal.resume();
                                        self.welcome();
                                    })
                            } else {
                                self.display("Please use either 'create' or 'login'");
                                self.welcome();
                            }
                        }, {
                            prompt : "> "
                        });    
                    },
                    
                    cmd_create : function(name, password) {
                        var promise = $.Deferred();
                        
                        Tradewars.Client.accountcreate({ name : name, password : password }, function(results) {
                            console.log(results);
                            if( results.success ) {
                                promise.resolve();
                            } else {
                                promise.reject();
                            }
                        });
                        
                        return promise.promise();
                    },
                    
                    cmd_login : function(name, password) {
                        var promise = $.Deferred();
                        
                        Tradewars.Client.accountlogin({ name : name, password : password }, function(results) {
                            console.log(results);
                            if( results.success ) {
                                promise.resolve({ user : results.user });
                            } else {
                                promise.reject({ message : results.message });
                            }
                        });
                        
                        return promise.promise();
                    }
                }
            }
        } 
    });
})(jQuery);