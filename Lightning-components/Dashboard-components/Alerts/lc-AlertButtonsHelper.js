({
    getObjectJS : function(component, event) {
        var action = component.get("c.getAlertCount");
        action.setParams({
            whatProduct: 	component.get("v.whatProduct"),	
            whatObject:		component.get("v.whatObject"),
            howManyDays:  	component.get("v.lookBackDays")
        });
        action.setCallback(this, function(response){
            var state 		= response.getState();
            var returnValue = response.getReturnValue();     

            if (state === "SUCCESS") {
                component.set("v.alertCount", returnValue);
                if(returnValue.cnt != "0" && returnValue.cnt != undefined) { // If there's values in the array and the cnt value is greater than 0
                    var cmpTarget = component.find("alert");				//get the tag with the aura:id of 'alert'
                    $A.util.removeClass(cmpTarget , 'hidden');				//display the alert;
                }             
            }          
        });
        $A.enqueueAction(action); 
    },
    
    applyStyleJS : function(component, event) {	
        var wantDP			= component.get("v.whatProduct");
        var _useFA			= component.get("v.iconLink");
        var _firstString	= _useFA.substring(0, 2);

        //Use DP styling
        if (wantDP == 'DonorPerfect'){
            var cmpTarget = component.find("button-alert");
            $A.util.addClass(cmpTarget , 'dp-style');
        }
        
        // Use Font Awesome or SFLDS icons
        if(_firstString == 'fa') {
            component.set("v.useFontAwesome", true);	//use font awesome
        } else {
            component.set("v.useFontAwesome", false);	//use SF icons
        }
    }
})