({    
    onLoadJs: function(component, event) {  
        var action = component.get("c.getCurrentUser");	//Get User function in apex class 
        
        //Call User function in apex class and get its values     
        action.setCallback(this, function(response) {
            if (response.getState() === "SUCCESS") {
                component.set("v.userInfo", response.getReturnValue()); //Set userInfo value to Apex returns            
            } else if (response.getState() === "ERROR") {
                $A.log("Errors", response.getError());
            }
        });        
        $A.enqueueAction(action);  
    },    
    
	enableSubmitJs: function(component, event) {
    	var _checkCount	= component.get("v.checkNum");		//Get attribute       
        var _target		= event.target.checked; 			//Get checkbox that was clicked
        
        //If the checkbox is checked off
        if (_target === true) {
        	_checkCount = _checkCount + 1; 					//update the counter
        } else {
            _checkCount = _checkCount - 1;
            if (_checkCount < 0) { _checkCount = 0};
        }
        component.set ("v.checkNum", _checkCount);			//Update the attribute with the new count
        
        if (_checkCount === 0){            
            component.set ("v.isEnabled", false);			//Update the boolean attribute to show the disabled submit button
        } else {
            component.set ("v.isEnabled", true);			//Update the boolean attribute to show the enabled submit button
        }        
    },
})