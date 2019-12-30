({   
    loadClassesJs : function(component) {   
        var toggleText 	= component.find("staff-list");        
        var action 		= component.get("c.getTrainingSchedule"); 		//Get function in apex class
        
        $A.util.toggleClass(toggleText, "hidden");						//Hide staff list people on start
        
        //Set the parameters for the apex method using the record id
        action.setParams({
            product: 	component.get("v.whichProduct")
        });
        
        action.setCallback(this, function(response) {
            if (response.getState() === "SUCCESS") {
                component.set("v.classes", response.getReturnValue());
                
                if (response.getReturnValue().length > 0) {						//If there are classes in the Object	
                    var classList	= component.get("v.classes");
                    var childCmp	= component.find("childDetails"); 			//Returns array of all details component unless there's only 1 class then it returns the component
                    var flagList	= component.find('flagIcon');
                    var maxSeats;
                    var seatsFilled;
                    var seatsEmpty;
                    
                    if (childCmp.length == undefined) {							//If there's only one class .find() returns the object so it doesn't have a length
                        maxSeats 	= classList[0].Max_registrants__c;			//Set the total seats available for the class
                        seatsFilled = classList[0].Registration_Count__c;		//Set the total seats filled for the class                        
                        //seatsFilled = 15;
                        seatsEmpty 	= maxSeats - seatsFilled;					//Find out how many seats are left
                        classList[0].seatsLeft__c = seatsEmpty;					//Add new item, seatsLeft__c, to the json object v.classList
                        
                        childCmp._hideDisclaimer(); 							//Call child component ClassDetails method to hide the disclaimer
                        
                        if (classList[0].Company_Owner__c === "DPC") {
                            $A.util.addClass(flagList, 'flag-Canada');			//Show Canada flag next to location
                        } else {
                            $A.util.addClass(flagList, 'flag-US');				//Show US flag next to location
                        }
                    } else {
                        for(var i = 0; i < childCmp.length; i++){				//If there's multiple classes .find() returns an array
                            maxSeats 	= classList[i].Max_registrants__c;		//Set the total seats available for the class
                        	seatsFilled = classList[i].Registration_Count__c;	//Set the total seats filled for the class                            
                            //seatsFilled = 15;
                            seatsEmpty 	= maxSeats - seatsFilled;				//Find out how many seats are left
                            classList[i].seatsLeft__c = seatsEmpty;				//Add new item, seatsLeft__c, to the json object v.classList
                            
                            childCmp[i]._hideDisclaimer(); 						//Call child component ClassDetails method to hide the disclaimer
                            
                            if (classList[i].Company_Owner__c === "DPC") {
                                $A.util.addClass(flagList[i] , 'flag-Canada');	//Show Canada flag next to location
                            } else {
                                $A.util.addClass(flagList[i] , 'flag-US');		//Show US flag next to location
                            }
                        }
                    } 
                    this.dateRangeJs(component);								//Run the function to determine the dates for the class
                } else {														//If there are no classes 
                    component.set("v.noClasses", true); 
                }                
                
            } else if (response.getState() === "ERROR") {
                $A.log("Errors", response.getError());
            }
        });        
        $A.enqueueAction(action);
    },
    
    dateRangeJs : function(component) { 
        var classEndDate	= component.find("end-date");		//find the span tag that contains the end date
        var classList		= component.get("v.classes");
        var numOfClasses	= classEndDate.length;				//set the variable to the # of times the end date span tag appears

        if (numOfClasses == undefined) { numOfClasses = 1; }	//set variable value if the 'find' is not an array b/c there's only 1 aura:id
        
        for(var i = 0; i < numOfClasses; i++){
            var classDates		= [];
            var startDate		= new Date(classList[i].Date__c);
            var endDate			= new Date(classList[i].End_Date__c);
            var startDateUTC	= new Date(startDate.getTime() - startDate.getTimezoneOffset() * -60000 ); //Calculation used correct JS Eastern Daylight Time Zone default         
            var currentDate		= startDateUTC;
            
            //If the end date field in SF is blank set the date to the start date
            if (isNaN(endDate) || !endDate) {
                var endDateUTC	= new Date(startDateUTC);
            } else {
                var endDateUTC 	= new Date(endDate.getTime() - endDate.getTimezoneOffset() * -60000 ); //Calculation used correct JS Eastern Daylight Time Zone default 
            }        

            //Hide or show the end date for the class description if it's a multi-day class
            if (startDateUTC >= endDateUTC || endDateUTC == null || endDateUTC == undefined) {
                if(numOfClasses == 1) {
                    $A.util.addClass(classEndDate, 'hidden');
                } else {
                    $A.util.addClass(classEndDate[i], 'hidden');
                }
            }
            
            //Push the dates into an array until the end date is reached
            while (currentDate <= endDateUTC) {
                classDates.push(new Date(currentDate));
                currentDate.setDate(currentDate.getDate() + 1);
            }
            
            classList[i].dateRange__c = classDates; //Add new item, dateRange__c, to the json object v.classList          
        }   
    },
})