({
    doInitJs: function(component, event, helper){   
        helper.getTotalsJS(component, event);
        helper.applyStyleJS(component, event);
    },
    
    gotoURL: function(cmp, event) {
        var myURL		= cmp.get("v.url");
        var urlEvent	= $A.get("e.force:navigateToURL");
        
        urlEvent.setParams({
            "url": myURL
        });
        urlEvent.fire();                          
    },  
})