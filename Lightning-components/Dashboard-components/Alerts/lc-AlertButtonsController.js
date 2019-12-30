({
    doInitJs: function(component, event, helper){   
        var thisObject = component.get("v.whatObject");
        if (thisObject.toLowerCase().indexOf("none") == -1) {
            helper.getObjectJS(component, event);
        }            
        helper.applyStyleJS(component, event);
    },
    
    gotoURL: function(cmp, event) {
        var myURL;
        var urlList		= cmp.get("v.urlLinkList");
        var urlDetail	= cmp.get("v.urlLinkDetail");
        var thisID		= cmp.get("v.alertCount");
		
        //If there's an id pulled from the apex class and a value for the url detail field
        if(thisID.id != undefined && urlDetail.length > 0){
            myURL = urlDetail + thisID.id;
        } else {
            myURL = urlList;
        }

        var urlEvent	= $A.get("e.force:navigateToURL");
        urlEvent.setParams({
            "url": myURL
        });
        urlEvent.fire();                          
    },  
})