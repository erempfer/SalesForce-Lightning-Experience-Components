({
    doInitJs: function(component, event, helper){   
        helper.getTopIdeasJS(component, event);		//run the function to pull in the ideas from SF
        helper.applyStyleJS(component, event);		//add the dp class name to style the component
        helper.getMyZones(component);				//get the product zone for ideas
    },
    
    gotoURL: function(component, event) {
        var myURL1		= component.get("v.urlOne");			//get the aura attribute for the primary link (main s&v)
    	var myURL2		= component.get("v.urlTwo");			//get the aura attribute for the secondary link (idea detail)
		var zones		= component.get("v.zoneIds");			//get the aura attribute 
    	var ideaId		= event.currentTarget.dataset.id;		//get the id of the currently clicked idea
    	var commId		= event.currentTarget.dataset.commid;	//get the zone id of the currently clicked idea
        var finalDest 	= myURL1;
		var whichProduct;
        
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
        var urlEvent = $A.get("e.force:navigateToURL");        
        urlEvent.setParams({
            "url": finalDest
        });
        urlEvent.fire();  
    },
    
    createVote : function(component, event, helper) {   
        //Get the class names on the a tag DOM element clicked
        var whatClass = event.target.parentElement.classList.value;
        if (whatClass !== 'voted-up' && whatClass !== 'voted-down' && whatClass !== 'inactive'){
            helper.upsertVoteJS(component, event);		//run the function to vote
        }
    },
    
    showSpinner : function(component, event){
        // display spinner when aura:waiting (server waiting)
        component.set("v.isLoading", true);  
    },
    
    hideSpinner : function(component, event){
        // hide when aura:downwaiting
        component.set("v.isLoading", false);
    },
})