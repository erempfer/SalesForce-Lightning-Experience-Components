({
    getTotalsJS : function(component, event, helper) {
        var whatStatus 	= component.get("v.whatStatus");
        var action 		= component.get("c.getAllIdeasByStatus");
        
        //Set the parameters for the apex method using the product name
        action.setParams({
            whatZone: component.get("v.whatProduct")
        });
        
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                let val = response.getReturnValue();
                var dataset=[];
                //console.log(val);
                var ideaTotal = 0;
                //Get the values for each status and add them to the total
                val.forEach(function(key) {
                    if (key.label == whatStatus) {
                        component.set("v.ideasTotal", key.count);
                    }
                    ideaTotal = key.count + ideaTotal;                   
                });                
            }
        });
        $A.enqueueAction(action);        
    },
    
    applyStyleJS : function(component, event) {	
        var whatProduct		= component.get("v.whatProduct");
        var _useFA			= component.get("v.iconName");
        var _firstString	= _useFA.substring(0, 4);
        var whatStatus 		= component.get("v.whatStatus");
		var iconTarget 		= component.find("status-icon"); 
        var _statDup		= 'Already Exists';
        var _statYes		= 'Coming Soon';
        var _statDone		= 'Completed';
        var _statMaybe		= 'Considering';
        var _statNo			= 'Declined';
        var _statWorking	= 'Planned';
        
        //Use DP styling
        if (whatProduct == 'DonorPerfect' || whatProduct == 'DP Online Forms'){
            var cmpTarget = component.find("main-container");
            $A.util.addClass(cmpTarget , 'dp-style');
        }
        
        // Use Font Awesome or Image File
        if(_firstString != 'slds') {
            component.set("v.useFontAwesome", true);
        } else {
            component.set("v.useFontAwesome", false);
        }
        
        //Adjust color
         if (whatStatus == _statDone) {
            $A.util.addClass(iconTarget , 'stat-done');
        } else if (whatStatus == _statWorking) {
            $A.util.addClass(iconTarget , 'stat-working');
        } else if (whatStatus == _statYes) {
            $A.util.addClass(iconTarget , 'stat-yes');
        } else if (whatStatus == _statMaybe) {
            $A.util.addClass(iconTarget , 'stat-maybe');
        } 
    }
})