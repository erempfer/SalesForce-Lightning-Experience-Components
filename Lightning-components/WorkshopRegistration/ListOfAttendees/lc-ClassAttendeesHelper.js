({    
    onLoadJs : function(component, event) {      
        var counterUpdate 	= component.get("v.regCounter");
        var isVirtClass		= component.get("v.isVClass");
        var startPrice 		= component.get("v.rate");
        var action 			= component.get("c.getCurrentUser");	//Get User function in apex class 
        var action2 		= component.get("c.getContacts"); 		//Get Contacts function in apex class
        
        if (isVirtClass) {								//If the class is virtual
            counterUpdate = 3;							//Set the max number of attendants to 3 per Lori S. request
        }
        
        counterUpdate = counterUpdate - 1; 				//User starts off checked but it's not recorded as an event so subtract 1
        component.set("v.regCounter", counterUpdate); 	//Update counter to reflect User being checked        
        component.set("v.subTotal", startPrice);		//Set sub total value to rate value to start               
        
        //Call User function in apex class and get its values     
        action.setCallback(this, function(response) {
            var _state = response.getState();
            var _value = response.getReturnValue();            
            if (_state === "SUCCESS") {
                component.set("v.userInfo", _value); //Set userInfo value to Apex returns   
                
                //Find the number of seats open for the class
                var _seatsAvailable = component.get("v.seatsOpen");
                if (_seatsAvailable <= 0) {
                    var payNowButton 		= component.find("payNow");
        			var payLaterButton 		= component.find("payLater");
                    var soldOutSign			= component.find("soldOut");
                    $A.util.toggleClass(payNowButton, "hidden"); 	//Show or hide pay buttons by adding and removing CSS class       
        			$A.util.toggleClass(payLaterButton, "hidden");	//Show or hide pay buttons by adding and removing CSS class
                    $A.util.toggleClass(soldOutSign, "hidden");	//Show or hide pay buttons by adding and removing CSS class
                }       
            } 
            else if (_state === "ERROR") {
                var _errors = response.getError();
                if (_errors) {
                    if (_errors[0] && _errors[0].message) {
                        console.log("Error message: " + _errors[0].message);
                    }
                } else {
                    console.log("Unknown error");
                }
            }
        });        
        $A.enqueueAction(action);          
        
        //Call Contacts function in apex class and get its values
        action2.setCallback(this, function(response) {
            var _state = response.getState();
            var _value = response.getReturnValue();
            if (_state === "SUCCESS") {
                component.set("v.myContacts", _value);                
                if(_value.length > 0) { 							//If there are contacts                    
                    var showButton = component.find("show-staff");	//Find button with show-staff aura id
                    $A.util.toggleClass(showButton, "hidden"); 		//Show the add more people button
                }                
            } 
            else if (_state === "ERROR") {
                var _errors = response.getError();
                if (_errors) {
                    if (_errors[0] && _errors[0].message) {
                        console.log("Error message: " + _errors[0].message);
                    }
                } else {
                    console.log("Unknown error");
                }
            }
        });        
        $A.enqueueAction(action2);
    },
    
    getCanadianTaxJs : function(component, event) {
        var action = component.get("c.getCanadianTax");
        
        action.setCallback(this, function(response) {
            if (response.getState() === "SUCCESS") {
                var taxRate			= response.getReturnValue();				//Get tax percent rate
                var classType		= component.get("v.classType");				//Get the class type from the parent component ClassList
                var classString		= component.get("v.vClassString");			//Get the virtual class string from the parent component ClassList
                var whichOwner 		= component.get("v.companyOwner");			//Get where the class is
                var totalDays		= component.get("v.dateRange").length;		//Get the total number of class days
                var classRate		= component.get("v.subTotal");				//Get the price for the class w/o tax
                var subTotal		= classRate * totalDays; 
                var discRate		= component.get("v.discRate");				//Get multi-day discount rate from parent LC-ClassList
                var discAmt			= discRate * (totalDays - 1);				//Subtract 1 day because there's no discount for a single day
                var subtotalDisc	= subTotal - discAmt;
                var taxPrice		= 0; 
                if(whichOwner === "DPC" || classType === classString) {			//If the owner is DPC or the class is a virtual webinar
                    taxPrice	= subtotalDisc * taxRate;						//Calculate tax amount if class is in Canada
                }            
                var totalStartAmt	= subtotalDisc + taxPrice;					//Add class price plus tax             
                
                component.set("v.discTotal", discAmt);							//Set the discount amount
                component.set("v.taxPercent", taxRate); 						//Set tax value to attribute               
                component.set("v.taxAmount", taxPrice);							//Set tax dollar amount
                component.set("v.totalPrice", totalStartAmt);         			//Set total amount
                component.set("v.subTotal", subTotal); 
                component.set("v.noTaxAmount", subtotalDisc);					//Set subtotal including discount but not tax
                
                if(taxRate > 0 && (whichOwner === "DPC" || classType === classString)) {
                    component.set("v.showTax", true);							//Show tax amount if in Canada                    
                }                    
            } else if (response.getState() === "ERROR") {
                $A.log("Errors", response.getError());
            }
        });        
        $A.enqueueAction(action);
    },
    
    runToggleJs : function(component, event) {                
        var attendanceList 	= component.find("staff-list").getElement();
        var showButton 		= component.find("show-staff");
        var hideButton 		= component.find("hide-staff");
        
        //Adjust class detail height to show/hide info
        if(event.target.className.includes("show-more")) {
            attendanceList.style.maxHeight 	= "5000px";					//Show class details
        } else {
            attendanceList.style.maxHeight 	= "0";						//Hide class details
        }
        
        $A.util.toggleClass(showButton, "hidden"); 	//Show or hide toggle buttons by adding and removing CSS class       
        $A.util.toggleClass(hideButton, "hidden");	//Show or hide toggle buttons by adding and removing CSS class     
    }, 
    
    runOnOffJs : function(component, event) {         
        var newPrice 	= component.get("v.totalPrice");
        var peepsLeft 	= component.get("v.regCounter");
        
        //Get checkbox value from ClassAppEvent sent from ClassCheckbox component        
        if (event.getParam("checkboxValue") === true)
        {
            //Change 'people' to 'person' in limit-counter message when they can only register 1 more person
            if (peepsLeft === 1) {
                component.find("text-peeps").set('v.value', 'person');
            }
            else if (peepsLeft === 0) {                
                var childCmp = component.find("peepsCheckBox"); // returns array of all checkboxes
                for(var i = 0; i < childCmp.length; i++){
                    childCmp[i]._turnOff(); 					//run child component ClassCheckBox function to disable checkboxes
                }               
                $A.util.toggleClass(component.find("limit-counter"), "hidden"); //Toggle warning message
                $A.util.toggleClass(component.find("limit-reached"), "hidden"); //Toggle warning message
            }
        } else {
            if (peepsLeft === 1) {               
                var childCmp = component.find("peepsCheckBox"); // returns array of all checkboxes
                for(var i = 0; i < childCmp.length; i++){
                    childCmp[i]._turnOn(); 						//run child component ClassCheckBox function to enable checkboxes
                }                                
                $A.util.toggleClass(component.find("limit-counter"), "hidden"); //Toggle warning message
                $A.util.toggleClass(component.find("limit-reached"), "hidden"); //Toggle warning message
            }
            else if (peepsLeft === 2) {                
                component.find("text-peeps").set('v.value', 'people'); //Change 'person' to 'people'
            }
        }
        
        //Disable the registration buttons if price is 0
        if (newPrice === 0) {
            component.find("payNow").set("v.disabled", true);
            component.find("payLater").set("v.disabled", true);
        } else {
            component.find("payNow").set("v.disabled", false);
            component.find("payLater").set("v.disabled", false);
        }    
    },
    
    runURLJs : function (component, event) {         
        component.set("v.warningOn", "false"); //Reset warning variable
        
        var _whichButton 		= event.getSource().getLocalId(); 	// Get aura id of button pressed
        var _classID 			= component.get("v.classID");
        var _subTotal			= component.get("v.subTotal");
        var _noTaxAmt			= component.get("v.noTaxAmount");
        var _taxAmt				= component.get("v.taxAmount");
        var _classPrice 		= component.get("v.totalPrice");
        _classPrice			= Math.round((_classPrice + 0.00001) * 100) / 100;		//Round to 2 decimal places
        var _companyOwner		= component.get("v.companyOwner");
        var _canadaString		= "DPC"; 												//String in the dropdown field of the Training Event object
        var _frenchString		= "French";
        var _user 				= component.find("contact-info").getElement();
        var _userFN 			= _user.dataset.fn;
        var _userLN 			= _user.dataset.ln;
        var _userID 			= _user.dataset.id;
        var _userContactID		= _user.dataset.ctid;
        var _userEMAIL 			= _user.dataset.email;
        var _userAccName 		= _user.dataset.an;
        var _userAccID 			= _user.dataset.aid;
        var _userLanguage		= _user.dataset.lang;
        var _userClientID 		= _user.dataset.acid;       
        var _attendeeInfo 		= []; 								//Contact variables
        var _childCmp 			= component.find("peepsCheckBox");	// returns array of all checkboxes
        var _counter 			= 0; 								//Start number of attendees at zero
        var _isVirtualClass		= component.get("v.isVClass");
        
        /*
        console.log('*****************************');
        console.log('*****************************');
        console.log('BUTTON PRESSED:', _whichButton);
        console.log('-------------------');
        console.log('Class Id:' , _classID);
        console.log('Class Total Cost:' , _classPrice);
        console.log('-------------------');
        console.log('User First:' , _userFN);
        console.log('User Last:' , _userLN);
        console.log('User Id:' , _userID);
        console.log('User Email:' , _userEMAIL);
        console.log('-------------------');
        console.log('Account Name:' , _userAccName);
        console.log('Account Id:' , _userAccID);
        console.log('Client Id:' , _userClientID);
        console.log('-------------------');
        console.log('Subtotal:' , _subTotal);
        console.log('Class Price:' , _classPrice);
        console.log('Tax:' , _noTaxAmt);
		*/
        
        //Loop through all checkboxes and get only the values of the ones that are checked
        for(var i = 0; i < _childCmp.length; i++) {            
            var isOn = _childCmp[i].get("v.nameChecked"); 		//Get checkboxes that are checked         
            if (isOn === true) {                
                _counter = _counter + 1; 						//Set counter for num of attendees
                
                var dateArray 		= _childCmp[i].get("v.daysAttending"); 
                var dateAttending 	= [];
                
                for(var j = 0; j < dateArray.length; j++) {
                    var singleDate 	= new Date (dateArray[j].toString());	//Get the individual dates from the array
                    var _month		= singleDate.getMonth() + 1;			//Get the month, which is 0 based so add a 1
                    var _day		= singleDate.getDate();					//Get the day of the month
                    var _year		= singleDate.getFullYear();				//Get the year
                    var _formatDate	= _month + '-' + _day + '-' + _year;	//Format the date
                    dateAttending.push(_formatDate);						//Put in the blank array that will be used to send to the form    
                }
                
                /*
                console.log('Contact Name:', _childCmp[i].get("v.labelName"));
                console.log('Contact Id:', _childCmp[i].get("v.userId"));
                console.log('Contact Experience:', _childCmp[i].get("v.expLevel")); 
                console.log('Dates Attending:', dateFormat);
                console.log('Number of Days:', _childCmp[i].get("v.daysAttending").length);
                console.log('Start Date:', dateAttending[0]);
                console.log(dateAttending);
                */
                
                //Push contact info to array to be pulled for url
                var _thisName 	= "&name" 		+ _counter + "=" + _childCmp[i].get("v.labelName");
                var _thisId 	= "&experience" + _counter + "=" + _childCmp[i].get("v.expLevel");
                var _thisExp	= "&contact_id"	+ _counter + "=" + _childCmp[i].get("v.userId");
                var _startDate	= "&trainingstartdate" + _counter + "=" + dateAttending[0];	
                var _numOfDays	= "&numbertrainingdays" + _counter + "=" + _childCmp[i].get("v.daysAttending").length;
                var _attending	= "&trainingdaysattend" + _counter + "=" + dateAttending;
                _attendeeInfo.push( _thisName, _thisId, _thisExp, _startDate, _numOfDays, _attending );
                
                //Run child function in ClassCheckbox component
                _childCmp[i]._setWarning(); 		
                
                //Show warning message by registration buttons if needed
                if (component.get("v.warningOn") === "true") {
                    $A.util.removeClass(component.find("errorMessage"), "hidden"); //show warning                    
                } else {
                    $A.util.addClass(component.find("errorMessage"), "hidden"); //hide warning
                }
            }
        }
        
        //Put error code here so it can highlight days that aren't selected
        if (component.get("v.warningOn") === "true") {
            error("Experience level not selected");
        } else {
            //Check the aura id of the button clicked 
            if ( _whichButton === "payLater" ) {
                if( _companyOwner === _canadaString && ( _userLanguage.indexOf(_frenchString) > -1 ) && !_isVirtualClass ){                   								                                               
                    var _whichForm	= "https://interland3.donorperfect.net/weblink/WebLink.aspx?name=dpcanada&id=27" ;	//Pay Later Canadian Class French WebLink form
                } else if ( _companyOwner === _canadaString && !_isVirtualClass ) {
                    var _whichForm	= "https://interland3.donorperfect.net/weblink/WebLink.aspx?name=dpcanada&id=26"; 	//Pay Later Canadian Class English WebLink form
                } else if ( _isVirtualClass && _taxAmt > 0) {																			
                    var _whichForm	= "https://interland3.donorperfect.net/weblink/WebLink.aspx?name=dpcanada&id=40";	//Pay Later Canadian Virtual Class WebLink form
                } else if ( _isVirtualClass && _taxAmt === 0) {																			
                    var _whichForm	= "https://interland3.donorperfect.net/weblink/WebLink.aspx?name=website&id=80";	//Pay Later US Virtual Class WebLink form
                } else {
                    var _whichForm	= "https://interland3.donorperfect.net/weblink/WebLink.aspx?name=website&id=65"; 	//Pay Later US Class WebLink form
                }                
                var _fAmount = "&amtofinvoice=" + _classPrice; //Pay later form only
            } else {
                if( _companyOwner === _canadaString && ( _userLanguage.indexOf(_frenchString) > -1 ) && !_isVirtualClass){ 
                    /*
                   	_userClientID.indexOf("QF", _userClientID.length-2) > 0 || 
                    _userClientID.indexOf("OF", _userClientID.length-2) > 0 || 
                    _userClientID.indexOf("qf", _userClientID.length-2) > 0 || 
                    _userClientID.indexOf("of", _userClientID.length-2) > 0) ){
                    */
                    var _whichForm	= "https://interland3.donorperfect.net/weblink/WebLink.aspx?name=dpcanada&id=28"; 	//Pay Now Canadian French WebLink form
                } else if( _companyOwner === _canadaString && !_isVirtualClass ) {
                    var _whichForm	= "https://interland3.donorperfect.net/weblink/WebLink.aspx?name=dpcanada&id=25"; 	//Pay Now Canada English WebLink form
                } else if( _isVirtualClass && _taxAmt > 0) {
                    var _whichForm	= "https://interland3.donorperfect.net/weblink/WebLink.aspx?name=dpcanada&id=39";	//Pay Now Canada Virtual Class form
                } else if(_isVirtualClass && _taxAmt === 0 ) {
                    var _whichForm = "https://interland3.donorperfect.net/weblink/WebLink.aspx?name=website&id=79"		//Pay Now US Virtual Class form
                } else {
                        var _whichForm	= "https://interland3.donorperfect.net/weblink/WebLink.aspx?name=website&id=64"; //Pay Now US WebLink form
                    }                
                var _fAmount	= "&transactionamount=" + _classPrice; //Pay now form only
            }        	  
            
            var _fClassId 		= "&training_event_id="		+ _classID;
            var _fNumofPeeps	= "&num_attendees="			+ _counter;
            var _fCompanyName	= "&last_name="				+ _userAccName;
            var _fAccID 		= "&sfacctid=" 				+ _userAccID;
            var _fEmail			= "&email="					+ _userEMAIL; 
            var _fsubTotal		= "&notaxamt="				+ _noTaxAmt; //_subTotal;
            var _myURL 			= _whichForm + _fClassId + _fNumofPeeps + _fCompanyName + _fAccID + _fEmail + _fAmount + _fsubTotal;
            
            //Add contact information to url
            for(var i = 0; i < _attendeeInfo.length; i++) { 
                _myURL = _myURL + _attendeeInfo[i];
            }
            
            //Fire page event	
            var urlEvent = $A.get("e.force:navigateToURL");
            urlEvent.setParams({
                "url": _myURL
            });
            urlEvent.fire();            
        }   
    }, 
})