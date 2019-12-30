({        
    doInitJs: function(component, event, helper) { 
    	var classType	= component.get("v.classType");			//Get the class type from the parent component ClassList
        var classString = component.get("v.vClassString");
        if(classType === classString) {							//If it's a virtual class
            component.set("v.isVClass", true);					//Set the variable to true to hide certain fields
        }
    },
    
    toggleDetailsJs : function(component, event) {        
        var classDeets 		= component.find("class-details").getElement(); //Add getElement() to access the CSS styles
        var toggleBtn 		= component.find("show-details");
        var toggleText		= component.find("toggle-text").getElement();
        var faIcon 			= component.find("fa-icon").getElement();
        var cssClassNames	= event.currentTarget.className; 
        
        //Adjust class detail height to show/hide info
        if(cssClassNames.includes("show-more") || cssClassNames.indexOf("show-more") > -1) {
            classDeets.style.maxHeight 	= "1000px";					//Show class details
            faIcon.style.transform 		= "rotate(180deg)";			//Rotate icon
            toggleText.innerHTML 		= "Hide Class Details";		//Change button text
            $A.util.toggleClass(toggleBtn, "show-more");			//Remove class name
        } else {
            classDeets.style.maxHeight 	= "0";						//Hide class details
            faIcon.style.transform 		= "rotate(0deg)";			//Rotate icon
            toggleText.innerHTML 		= "Show Class Details";		//Change button text
            $A.util.toggleClass(toggleBtn, "show-more");			//Add class name
        }
    },
    
    toggleDisclaimerJs: function(component, event) {        
        var whatLevel = component.get("v.level"); //Get value of attribute named 'level'
        
        if(whatLevel === "Beginning Users"){
            var showDisclaimer = component.find("disclaimer");
            $A.util.addClass(showDisclaimer, "hidden"); //Add css class 'hidden' if value = 'Beginning Users'
        }
    },    
})