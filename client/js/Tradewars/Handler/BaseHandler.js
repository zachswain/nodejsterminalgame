(function($) {
    $.extend(true, window, {
        Tradewars : {
            Handler : {
                BaseHandler : $.extend(true, Backbone.Events, {
                    display : function(message) {
                        this.trigger("display", { message : message });
                    },
                    
                    handleCommand : function(command) {
                        console.log("Tradewars.Handler.BaseHandler " + command);
                    }
                })
            }
        } 
    });
})(jQuery);