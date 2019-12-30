({
    getClassJS : function(component, event, helper) {
        var thisProduct	= component.get("v.whatProduct");
        var action 		= component.get("c.getUpcomingClass");
        
        //Set the parameters for the apex method using the product name
        action.setParams({
            whatProduct: thisProduct
        });
        
        action.setCallback(this, function(response) {
            var state = response.getState();
           
            if (response.getState() === "SUCCESS") {
                component.set("v.classes", response.getReturnValue());
                if(response.getReturnValue().length < 1) {		// If there's no classes display the no class message
                    component.set("v.itExists", false);                                      
                }
            } else {
                component.set("v.itExists", false);
            }
        });
        $A.enqueueAction(action);        
    },
    
    applyStyleJS : function(component, event) {	
        var whatProduct		= component.get("v.whatProduct"); 
        
        //Use DP styling
        if (whatProduct == 'DonorPerfect' || whatProduct == 'DP Online Forms'){
            var cmpTarget 	= component.find("main-container");
            var cmpTarget2 	= component.find("main-container-no-classes");
            
            $A.util.addClass(cmpTarget , 'dp-style');
            $A.util.addClass(cmpTarget2 , 'dp-style');
        }
    }
})