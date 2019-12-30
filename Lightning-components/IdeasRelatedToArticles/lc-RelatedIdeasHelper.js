({
    getMyLinks: function(component) {       
        var action 	= component.get("c.getIdeas"); // name on the apex class
        
        //Set the parameters for the apex method using the record id
        action.setParams({
            get_recordid: 	component.get("v.theRecordId"),
            product: 		component.get("v.whatProduct"),
            howMany:		component.get("v.numOfIdeas")
        });
        
        //Get the values and if there aren't any values or they're null set the haslinks attribute to false
        action.setCallback(this, function(response) {
            if (response.getState() === "SUCCESS") {
                component.set("v.morelinks", response.getReturnValue());
                
                if(response.getReturnValue() == null || response.getReturnValue().length < 1) {                
                    component.set("v.haslinks", false); 
                } else {       
                    component.set("v.ideaLinks", response.getReturnValue());
                } 
            }  else {
                component.set("v.haslinks", false); // if there's an error getting the info from SalesForce
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