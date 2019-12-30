({
    doInitJs: function(component, event, helper){        
        helper.getArticleJS(component, event);
    },
    
    gotoURL : function (component, event, helper) {      
        var urlEvent 	= $A.get("e.force:navigateToURL");
        var whatURL		= component.get("v.url");	
        urlEvent.setParams({
            "url": whatURL
        });
        urlEvent.fire();
    }, 
})