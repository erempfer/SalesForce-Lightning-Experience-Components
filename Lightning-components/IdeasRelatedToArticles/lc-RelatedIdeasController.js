({
    doInit : function(component, event, helper) {
        helper.getMyLinks(component);
        helper.getMyZones(component);
    },
    
    gotoIdea: function(component, event) {
        var myURL1		= component.get("v.urlZone1");
    	var myURL2		= component.get("v.urlZone2");
		var zones		= component.get("v.zoneIds");
    	var ideaId		= event.target.getAttribute('data-id');
    	var commId		= event.target.getAttribute('data-commId');
		var whichProduct;
        var finalDest = myURL1;
        //Get all of the zone ids and names to look for when an idea is related to online forms
        for (var i = 0; i < zones.length; i++) { 
            if (zones[i].Id == commId) {
                whichProduct = zones[i].Name;
            }
        }
        //If the Zone is for EZCare or DonorPerfect use the first link on the property editor, if it's for WebLink use the 2nd link
        if (whichProduct == "EZCare" || whichProduct =="DonorPerfect") {
            finalDest = myURL1 + '#' + ideaId;
        } else {
            finalDest = myURL2 + '#' + ideaId;
        }
        
        //Set the link and fire off the action, baby
        var urlEvent	= $A.get("e.force:navigateToURL");        
        urlEvent.setParams({
            "url": finalDest
        });
        urlEvent.fire();  
        
        //force the page to refresh
        document.location.reload(true)
    },   
})