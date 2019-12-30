({
    getObjectJS : function(component, event) {
        var action = component.get("c.getBlog");
        action.setParams({
            product: component.get("v.whatProduct")
        });
        action.setCallback(this, function(response){
            var state = response.getState();
            if (state === "SUCCESS") {
                component.set("v.blogPost", response.getReturnValue());
                
                if(response.getReturnValue().length < 1) {		// If there's no article to return
                    component.set("v.itExists", false);                                      
                } else {                    
                    var _datePublish 	= component.get("v.blogPost");
                    var _dateToday		= new Date();
                    var _publishParse	= Date.parse(_datePublish[0].CreatedDate); 	// convert date to milliseconds
                    var _todayParse		= Date.parse(_dateToday);					// convert date to milliseconds
                    var _difference		= _todayParse - _publishParse;
                    var _bgColor		= _datePublish[0].Background_Color__c;
                    var _header			= component.find("blog-color");				//find the span with the aura id iconContainer

                    if(_difference < 518400000) { 									// if it's less than 6 days in milliseconds 
                        var cmpTarget = component.find('newRibbon');
                        $A.util.removeClass(cmpTarget, 'hidden');
                    }   
                    
                    //If there's a color value for the background
                    if (_bgColor === null || _bgColor === undefined) {}
                    else {
                        _bgColor = _bgColor.toLowerCase();                        
                        if (_bgColor == 'purple (donorPerfect) / light blue (ezcare)') {
                            _bgColor = 'purple';
                        }                    
                        //Add class name to header to style in CSS
                        $A.util.addClass(_header, _bgColor);
                    }
                }               
            }          
        });
        $A.enqueueAction(action); 
    },
    
    applyStyleJS : function(component, event) {	
        var wantDP			= component.get("v.whatProduct");
        
        //Use DP styling
        if (wantDP == 'DonorPerfect'){
            var cmpTarget = component.find("main-container");
            $A.util.addClass(cmpTarget , 'dp-style');
        }
    }
})