({
    doInitJs: function(component, event, helper){   
        helper.getObjectJS(component, event);
        helper.applyStyleJS(component, event);
    },
    
    gotoURL : function (component, event, helper) {      
        var _urlEvent 	= $A.get("e.force:navigateToURL");
		var _blogPost 	= component.get("v.blogPost");
        var _whatURL	= _blogPost[0].Blog_Link__c;       
        
        _urlEvent.setParams({
            "url": _whatURL
        });
        _urlEvent.fire();
    }, 
})