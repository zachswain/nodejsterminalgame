(function($) {
    $.extend(true, window, {
        Tradewars : {
            Handlers : {
                initialize : function(parameters) {
                    Tradewars.Handler.WelcomeHandler.initialize({
                        terminal : parameters.terminal
                    });
                    console.log("Tradewars.Handlers initialized");   
                }
            }
        } 
    });
})(jQuery);