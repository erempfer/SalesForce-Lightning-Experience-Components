({
    getMyLinks: function(component) {
        var _id = component.get("v.theRecordId");
        //console.log("The record id is: " + _id);
        
        var action = component.get("c.getArticle"); // name on the apex class
        
        //Set the parameters for the apex method using the record id
        action.setParams({
            get_recordid: 	component.get("v.theRecordId"),
            product: 		component.get("v.whatProduct")
        });
        
        //Get the values and if there aren't any values or they're null set the haslinks attribute to false
        action.setCallback(this, function(response) {
            if (response.getState() === "SUCCESS") {
                component.set("v.morelinks", response.getReturnValue());
                
                if(response.getReturnValue() == null || response.getReturnValue().length < 1) {                
                    component.set("v.haslinks", false); 
                } else {     
                    var _links 			= component.get("v.morelinks");
                    var _articles		= _links[0].Related_Information__c;
                    var _videos			= _links[0].Related_Video__c;    
                    var _misc			= _links[0].Related_Other__c;
                    var _articleDIV		= component.find('related-articles');	//Find div container
        			var _videoDIV 		= component.find('related-videos');
        			var _miscDIV		= component.find('related-misc');
                    var _articleHead 	= component.find('header-article');	// Find the header
                    var _videoHead 		= component.find('header-video');
                    var _miscHead 		= component.find('header-misc');
        			var _titleText1 	= component.get("v.title1");
        			var _titleText2 	= component.get("v.title2");
        			var _titleText3		= component.get("v.title3");        
                    
                    if(!_articles || _titleText1 == "") {						// If the field is empty		
                        $A.util.addClass(_articleDIV, 'hidden');
                        $A.util.addClass(_articleHead, 'hidden');
                        $A.util.addClass(_videoHead, 'no-margin');				// Add class to remove top margin
                    }   
                    if(!_videos || _titleText2 == "") {  						// If the field is empty
                        $A.util.addClass(_videoDIV, 'hidden');
                        $A.util.addClass(_videoHead, 'hidden');
                        if (!_articles || _titleText1 == ""){
                            $A.util.addClass(_miscHead, 'no-margin');				// Add class to remove top margin
                        }                        
                    }  
                    if(!_misc || _titleText3 == "") {							// If the field is empty
                        $A.util.addClass(_miscDIV, 'hidden');
                        $A.util.addClass(_miscHead, 'hidden');
                    }
                    if(!_articles && !_videos && !_misc)  {
                        component.set("v.haslinks", false);
                    }
                } 
            }  else {
                component.set("v.haslinks", false);
            }
            
        });
        $A.enqueueAction(action);
    },    
})
