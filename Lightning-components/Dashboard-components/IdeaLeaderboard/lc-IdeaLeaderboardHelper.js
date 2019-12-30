({
    getTopIdeasJS : function(component, event) {
        //Call the method from the apex class
        var action = component.get("c.getTopIdeasAP");
        
        //Set the parameters for the apex method using the product name
        action.setParams({
            whatZone: 	component.get("v.whatProduct"),
            howMany:	component.get("v.howMany")     
        });
        
        action.setCallback(this, function(response) {
            var state 		= response.getState();
            var topIdeas 	= response.getReturnValue();
            
            if (state === "SUCCESS") {
                
                if (response.getReturnValue().length > 0) {			
                    component.set("v.ideas", topIdeas );
                    
                    //Color the status names
                    var ideaList		= component.get("v.ideas");			//get the aura attribute
                    var ideaStatus		= component.find("idea-status");	//get the dom element with the aura id of 'idea-status'
                    var listOfIds		= [];								//create a new array to hold all of the current idea ideas
                    var _statDup		= 'Already Exists';
                    var _statYes		= 'Coming Soon';
                    var _statDone		= 'Completed';
                    var _statMaybe		= 'Considering';
                    var _statNo			= 'Declined';
                    var _statWorking	= 'Planned';
                    
                    //Loop through the idea results and add a class name to it's DOM element
                    for(var i = 0; i < ideaList.length; i++) {
                        //Adjust color
                        if (ideaList[i].Status === _statDone) {
                            $A.util.addClass(ideaStatus[i] , 'stat-done');	
                        } else if (ideaList[i].Status === _statWorking) {
                            $A.util.addClass(ideaStatus[i] , 'stat-working');	
                        } else if (ideaList[i].Status === _statYes) {
                            $A.util.addClass(ideaStatus[i] , 'stat-yes');	
                        } else if (ideaList[i].Status === _statMaybe) {
                            $A.util.addClass(ideaStatus[i] , 'stat-maybe');	
                        } else if (ideaList[i].Status === undefined || ideaList[i].Status === null) {
                            $A.util.addClass(ideaStatus[i] , 'hidden');	
                        }
                        //Add the top ideas' ids to the array
                        listOfIds.push(ideaList[i].Id);
                    }
                    //Set the aura attribute to the array of ids from the top ideas
                    component.set("v.ideaIds", listOfIds);
                    
                    //Run function to check if the user already voted on an idea and hide the buttons
                    this.voteCheckJS(component);                   
                }
            } else if (response.getState() === "ERROR") {
                $A.log("Errors", response.getError());
            }
        });
        $A.enqueueAction(action);        
    },
    
    applyStyleJS : function(component, event) {	
        var whatProduct		= component.get("v.whatProduct");		//get the product name
        var whatStatus 		= component.get("v.whatStatus");		//get the idea status
        var iconTarget 		= component.find("status-icon"); 		//get the dom element with the aura id of 'status-icon'
        var _statDup		= 'Already Exists';
        var _statYes		= 'Coming Soon';
        var _statDone		= 'Completed';
        var _statMaybe		= 'Considering';
        var _statNo			= 'Declined';
        var _statWorking	= 'Planned';
        
        //Use DP styling
        if (whatProduct == 'DonorPerfect' || whatProduct == 'DP Online Forms'){
            var cmpTarget = component.find("idea-leaderboard");
            $A.util.addClass(cmpTarget , 'dp-style');				//apply the class name to the element with the aura id of 'idea-leaderboard'
        }
        
        //Adjust color by adding a class name to the status
         if (whatStatus == _statDone) {
            $A.util.addClass(iconTarget , 'stat-done');
        } else if (whatStatus == _statWorking) {
            $A.util.addClass(iconTarget , 'stat-working');
        } else if (whatStatus == _statYes) {
            $A.util.addClass(iconTarget , 'stat-yes');
        } else if (whatStatus == _statMaybe) {
            $A.util.addClass(iconTarget , 'stat-maybe');
        } 
    },
    
    upsertVoteJS : function(component, event){
        var action = component.get("c.saveVote");
        action.setParams({
            ideaId: 	event.currentTarget.dataset.id,			//set the id of the idea clicked to the parameter in the method
            voteType: 	event.currentTarget.dataset.type 		//set the vote type (up or down) of the idea clicked to the parameter in the method
        });
        
        //If upsert of the account is success I want to alert the account Id back to the user.
        action.setCallback(this, function(response) {
            var state 		= response.getState();
            var topIdeas 	= response.getReturnValue();
            
            if (state === "SUCCESS") {
                //Refresh the Lightning Component
                $A.get('e.force:refreshView').fire();
            } 
        });
        $A.enqueueAction(action);
    },
    
    voteCheckJS : function(component, event) {
        //Grab the aura attributes
        var action 		= component.get("c.hasVoted");
        var ideaList	= component.get("v.ideas");
        var ideaIDs		= component.get("v.ideaIds");
        //Grab the aura id's from the dom elements
        var voteUp		= component.find("vote-up");
        var voteDown	= component.find("vote-down");        
        
        action.setParams({
            ideaId: ideaIDs
        });
        
        //If upsert of the account is success I want to alert the account Id back to the user.
        action.setCallback(this, function(response) {
            var state 	= response.getState();
            var didVote = response.getReturnValue();            
            
            if (state === "SUCCESS") {
                //If the array is filled
                if (didVote.length > 0) {
                    //Loop through the array and add a class name to hide the buttons if the user already voted on the idea
                    for(var i = 0; i < didVote.length; i++) {
                        if (didVote[i][0] == 'true') {
                            //If they already voted the idea up then style the buttons to be green (upvoted) and gray (inactive)
                            if (didVote[i][1] == 'Up') {
                                $A.util.addClass(voteUp[i], 'voted-up');
                                $A.util.addClass(voteDown[i], 'inactive');
                            } else if (didVote[i][1] == 'Down'){
                                $A.util.addClass(voteUp[i], 'inactive');
                                $A.util.addClass(voteDown[i], 'voted-down');
                            }
                        }
                    }
                }
            }
        });
        $A.enqueueAction(action);
    },
    
    getMyZones: function(component) {       
        var action 	= component.get("c.getZones"); //method name on the apex class
        
        //Get the values for the community zones
        action.setCallback(this, function(response) {
            if (response.getState() === "SUCCESS") {
                component.set("v.zoneIds", response.getReturnValue());
            }              
        });
        $A.enqueueAction(action);
    },  
})