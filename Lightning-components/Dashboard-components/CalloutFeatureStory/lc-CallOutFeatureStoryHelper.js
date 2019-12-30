({
    getArticleJS : function(component, event) {
        var action = component.get("c.getArticlesList");
        action.setParams({
            whichArticle: component.get("v.whichArticle")
        });
        action.setCallback(this, function(response){
            var state = response.getState();
            if (state === "SUCCESS") {
                component.set("v.articles", response.getReturnValue());
                
                if(response.getReturnValue().length < 1) {		// If there's no article to return
                    component.set("v.itExists", false);                                      
                } else {      
                    //Display 'NEW' ribbon
                    var _datePublish 	= component.get("v.articles");
                    var _dateToday		= new Date();
                    var _publishParse	= Date.parse(_datePublish[0].LastPublishedDate); 	// convert date to milliseconds
                    var _todayParse		= Date.parse(_dateToday);							// convert date to milliseconds
                    var _difference		= _todayParse - _publishParse;
                    if(_difference < 518400000) { 											// if it's less than 6 days in milliseconds 
                        var cmpTarget = component.find('newRibbon');
                        $A.util.removeClass(cmpTarget, 'hidden');
                    }                   
                    
                    var _url			= _datePublish[0].Cover_Image_Link__c;				// Get cover image's url from article
                    if(_url != '') {														// If there's a value
                        component.set("v.picture", _url)
                    }
                }               
            }          
        });
        $A.enqueueAction(action); 
    },
})