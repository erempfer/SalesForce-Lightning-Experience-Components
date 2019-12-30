({    
    //Run the functions when it loads
    doInitJs: function(component, event, helper) {
        var classType	= component.get("v.classType");			//Get the class type from the parent component ClassList
        var classString = component.get("v.vClassString");
        if(classType === classString) {							//If it's a virtual class
            component.set("v.isVClass", true);					//Set the variable to true to hide certain fields
        }
        
        helper.onLoadJs(component, event);
        helper.getCanadianTaxJs(component, event);			//Contains setting the initial class price   
    },
    
    //Hide/show staff
    toggleStaffJs : function(component, event, helper) {
        helper.runToggleJs(component, event);        
    }, 
    
    //Enable-disable staff if the max registration number is reached
    disableButtonsJs : function(component, event, helper) { 
        helper.runOnOffJs(component, event);
    },
    
    //Send the information over to the Online Form
    gotoURLJs : function (component, event, helper) {  
        helper.runURLJs(component, event);
    }, 
})