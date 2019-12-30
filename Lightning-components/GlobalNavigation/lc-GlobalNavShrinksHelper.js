({
	getHeaderJS : function(component, event) {
		var currentDate		= new Date();
		var currentMonth 	= currentDate.getMonth();
        currentMonth		= currentMonth + 1;				//getMonth is 0 based so add 1 to fit our # system
        var bgContainer		= component.find("navBar-buttons");

        //if Dec-Feb add a class name
        if(currentMonth == 1 || currentMonth == 2 || currentMonth == 12) {		
            $A.util.addClass(bgContainer, 'winter');
        } else if (currentMonth == 3) {											//if March
            $A.util.addClass(bgContainer, 'bday');
        }
	}
})