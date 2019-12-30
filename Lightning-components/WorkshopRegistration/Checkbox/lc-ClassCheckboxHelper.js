({
    //Show/hide the extra options when selected, update registrant counter, show/hide list when max signup is reached
    runUserCheckBoxJs : function (component, event) {                 
        var dateBoxes	= component.find("dateCheckbox");				//Get the date checkboxes
        var peepsLeft	= component.get("v.fromParentRegCounter");		//Get counter attribute from parent component (ClassAttendees)       
        var target		= event.getSource(); 							//Get checkbox that was clicked
        var targetOn	= target.get("v.value");
        var compEvents	= $A.get("e.c:ClassAppEvent"); 					//Get application event to store values        
        
        //If checkbox is checked on
        if (targetOn) {            										//If the user checkbox is on
            if (dateBoxes.length == undefined) {						//If there's only one date .find() returns the object so it doesn't have a length
                if(dateBoxes.getElement().checked) {					//Get only the checked dates
                    this.updateClassPrice(component, event, target.get("v.value"));	//Add all the checked dates to the price
                }                
            } else {                
                for(var i = 0; i < dateBoxes.length; i++) {				//If there's multiple classes .find() returns an array
                    if(dateBoxes[i].getElement().checked) {				//Get only the checked dates
                        this.updateClassPrice(component, event, target.get("v.value"));	//Add all the checked dates to the price
                    }                 
                }                
            }                  
            peepsLeft	= peepsLeft - 1; 								//Take away one spot for registration counter            
        } else {   
            if (dateBoxes.length == undefined) {						//If there's only one date .find() returns the object so it doesn't have a length
                if(dateBoxes.getElement().checked) {
                    this.updateClassPrice(component, event, target.get("v.value")); //Subtract all the checked dates from the price
                }                
            } else {
                for(var i = 0; i < dateBoxes.length; i++) {				//If there's multiple classes .find() returns an array
                    if(dateBoxes[i].getElement().checked) {				//Get only the checked dates
                        this.updateClassPrice(component, event, target.get("v.value")); //Subtract all the checked dates from the price              
                    } 
                }
            }    
            peepsLeft	= peepsLeft + 1; 								//Add one spot to registration counter
        }	          
        
        component.set("v.fromParentRegCounter", peepsLeft); 				//Update registration counter      
        compEvents.setParams({ "checkboxValue" : target.get("v.value") }); 	//Pass values to ClassAppEvent
        // Fire checkbox event to enable/disable registration buttons - listen for event in ClassAttendees component
        compEvents.fire();	   
    },    
    
    //Show/hide the extra options when selected, update registrant counter, show/hide list when max signup is reached
    runDateCheckBoxJs : function (component, event) { 
        var compEvents	= $A.get("e.c:ClassAppEvent"); 		//Get application event to store values        
        var target		= event.currentTarget;      		//Get the date checkbox that was selected
        var dateCount	= component.get("v.dateCounter");	//Get the current dates picked
        var countUpdate	= dateCount;						//Find out how many dates are clicked
		var daysGoing	= component.get("v.daysAttending");
        
        if(target.checked) {								//If the date is checked
            countUpdate = countUpdate + 1;					//Update the counter
			daysGoing.push(target.value); 					//Push the value to the end of the array           		
        } else {											//If the date is unchecked
            countUpdate = countUpdate - 1;					//Update the counter
            var index = daysGoing.indexOf(target.value)		//Find the array position of the value
            if (index > -1) {								//If it's in the array
                daysGoing.splice(index, 1);					//Remove the value from the array
            }
        }
		//Sort the String array by converting them to dates and organizing by earliest date
        daysGoing.sort(function(a, b) {
            var dateA = new Date(a), dateB = new Date(b);
            return dateA - dateB;
        });        
        
        component.set("v.daysAttending", daysGoing);
        component.set("v.dateCounter", countUpdate);
               
       	//Run function to update the price
        this.updateClassPrice(component, event, target.checked, false); 	
        //Run function to add warning message
        this.selectALevelJs(component, event); 	 
        // Fire checkbox event to enable/disable Pay Now Buttons if the price is 0
        compEvents.fire();	   
    },
    
    //Update total price based on price
    updateClassPrice : function (component, event, checkboxValue, fromUserCheckbox=true) {  	 
        var numOfDays	= component.get("v.dateCounter");			//Get the current dates picked       
        var classPrice	= component.get("v.fromParentRate");		//Get rate attribute from parent component (ClassAttendees)
        var taxPercent	= component.get("v.fromParentTaxPerc");
        var taxRate		= component.get("v.fromParentTaxRate");
        var discRate	= component.get("v.fromParentDiscRate");	//Get multi-day discount rate from parent LC-ClassAttendees
        var discTotal	= component.get("v.fromParentDiscTotal");	//Get the total discount amount from LC-ClassAttendees
        var subTotal	= component.get("v.fromParentSubTotal");
        var totalPrice	= component.get("v.fromParentTotalPrice");	//Get price attribute from parent component (ClassAttendees)
        var classOwner	= component.get("v.fromParentOwner"); 		//Get whether the class is in Canada (DPC) or USA
		var classType	= component.get("v.fromParentClassType");		//Get the class type from the grandparent component ClassList
        var classString	= component.get("v.fromParentVirtClassString"); //Get the string name from the gradparent component ClassList, vClassString
        var newSubTotal;
        var newTaxRate;
        var newTotal; 
        var newDiscount = discTotal;
        var isChecked	= checkboxValue; 							//The 'checked' value of the checkbox
        var fromUser	= fromUserCheckbox;
        var discMinusFirstDay = discRate - (discRate/numOfDays);	//Since there's no discount for the first day we get the first days discount
        															//divide it among the selected days and subtract the difference among the rest of the days
        //If checkbox is checked on
        if (isChecked) { 
            newSubTotal	= subTotal + classPrice;				//Calculate new base price
            if (fromUser) {
                newDiscount = discTotal + discMinusFirstDay;	//Add to the discount total amount
            } else {											//If it's run from the date checkbox
                if(numOfDays > 1) { 							//If more than 1 checkbox is checked				
                    newDiscount = discTotal + discRate;			//Update the discount
                }
            }            
        } else {   
            newSubTotal	= subTotal - classPrice;				//Calculate new base price
			if (fromUser) {
            	newDiscount = discTotal - discMinusFirstDay;	//Subtract from the total discount
            } else {											//If it's run from the date checkbox
                if(numOfDays > 0) { 							//If more than 1 checkbox is checked
                    newDiscount = discTotal - discRate;			//Update the discount
                }
            }             
        }
        newTotal 	= newSubTotal - newDiscount;		//Set new total with the discount
        newTaxRate	= newTotal * taxPercent;			//Calculate tax at new base price
        component.set("v.fromParentNoTaxAmt", newTotal);//Set the subtotal including the discount but not including the tax
        
        if(classOwner === "DPC" || classType === classString) {
            newTotal = newTotal + newTaxRate;			//Set the new total with the Canadian tax
        }            
        
        component.set("v.fromParentSubTotal", newSubTotal);			//Update base price
        component.set("v.fromParentTaxRate", newTaxRate); 			//Update tax
        component.set("v.fromParentDiscTotal", newDiscount);		//Update total discount
        component.set("v.fromParentTotalPrice", newTotal); 			//Update total cost         
    },
    
    runDisableJs : function (component, event) {        
        var getBox			= component.find("my-checkbox"); 			//Find all checkboxes       
        var checkBoxValue	= getBox.get("v.value");  					//Get their value
        
        //Disable all checkboxes that aren't checked off when max limit is reached
        if (checkBoxValue === false) {
            getBox.set("v.disabled", true);
            $A.util.addClass(component.find("main"), "turned-off");
        }
    },
    
    runEnableJs : function (component, event) {        
        var getBox 			= component.find("my-checkbox");			//Find all checkboxes        
        var checkBoxValue 	= getBox.get("v.value"); 					//Get their value
        
        //Enable all checkboxes that aren't checked off when max limit is reached
        if (checkBoxValue === false) {
            getBox.set("v.disabled", false);
            $A.util.removeClass(component.find("main"), "turned-off");
        }
    },
    
    changeLevelJs : function (component, event) {        
        var target 		= event.getSource(); 		//Get the dropdown that was chosen        
        var expUpdate 	= event.getParam("value"); 	//target.get("v.value");	//Get the new value        
        component.set("v.expLevel", expUpdate); 	//Set component attribute to new experience level
    },
    
    selectALevelJs : function (component, event) {        
        var userCheckBox	= component.find("my-checkbox");	//Get the user checkbox
        var userOn			= userCheckBox.get("v.value");		//Get the value of the checkbox
        var dateBoxes		= component.find("dateCheckbox");	//Get the date checkboxes
        var dateLabel		= component.find("dateLabel");
        var noneSelected	= true;
        var counter			= 0;

        if (userOn && dateBoxes.length > 0 ) {           		//If the user is checked and there are several dates     
            for(var i = 0; i < dateBoxes.length; i++) {			//Loop through all the dates
                if(!dateBoxes[i].getElement().checked) {		//Look for the unchecked dates
                    counter = counter + 1;						//Add to the counter if dates are unchecked
                }                	           
            }   
        }
        if (counter == dateBoxes.length) {						//If all the dates are unchecked
            noneSelected = false;		
        }
        
        if(!noneSelected) {
            $A.util.removeClass(component.find("level-warning"), "hidden"); 	//show warning message
            for(var i = 0; i < dateBoxes.length; i++) {
                $A.util.addClass(dateLabel[i], "warning-outline"); 				//show warning style on the checkboxes
            }
            component.set("v.fromParentWarningOn", "true");
        } else {
            $A.util.addClass(component.find("level-warning"), "hidden"); 		//hide warning message
            for(var i = 0; i < dateBoxes.length; i++) {
                $A.util.removeClass(dateLabel[i], "warning-outline"); 			//hide warning style on the checkboxes
            }
        }
    }
})