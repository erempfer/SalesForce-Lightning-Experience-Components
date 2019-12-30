({    
    doInitJs : function(component, event, helper) {
        var whatDates 	= component.get("v.fromParentDates");	//Get the date range
        var dateLength 	= whatDates.length;						//Get the length of the array (dates)  
        var daysGoing	= component.get("v.daysAttending");
        
        //Hide the checkboxes if there's only 1 date
        if (dateLength > 1) {									
            component.set("v.fromParentOneClass", false);
        }
        component.set("v.maxDateCounter", dateLength);			//Set value to number of days in date range
        component.set("v.dateCounter", dateLength);				//Set same value to be used in helper - runDateCheckBoxJs  
		
        for(var i = 0; i < dateLength; i++) {					
            daysGoing.push(whatDates[i].toString());			//Fill up the dates attending array
        }       
    },
    
    //Called from the user/contact checkbox
    clickedBoxJs : function(component, event, helper) {
        helper.runUserCheckBoxJs(component, event);
    },
    
    //Called from the date checkboxes
    clickedDateJs : function(component, event, helper) {
        helper.runDateCheckBoxJs(component, event);
    },
    
    //Called from the radio button group
    onSelectChangeJs : function(component, event, helper) {
        helper.changeLevelJs(component, event);
    },
    
    //Called from ClassAttendees LC in the runOnOffJs helper
    disableBoxesJs : function(component, event, helper) {
        helper.runDisableJs(component, event);
    },
    
    //Called from ClassAttendees LC in the runOnOffJs helper
    enableBoxesJs : function(component, event, helper) {
        helper.runEnableJs(component, event);
    },
    
    //Called from ClassAttendees LC in the runURLJs helper
    noLevelDetectedJs : function(component, event, helper) {
        helper.selectALevelJs(component, event);
    },
})