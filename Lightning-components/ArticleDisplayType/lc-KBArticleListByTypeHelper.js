({
    addDivJs: function(cmp) {
        var _hasTopic = cmp.get("v.hasTopic");
        
        if (_hasTopic){  											//Run this code only if the article has a Topic__c field
            var _elementArray	= cmp.find("top_container");		//Find element that has aura:id of 'top_container'
            var _articleList	= cmp.get("v.articles");
            var _columns		= cmp.get("v.twoColumns");
            var _id				= cmp.get("v.docID");
            
            if (_elementArray != null && _elementArray != undefined) {    
                var _attendance		= [];							//Create a blank array to compare values against
                var _array			= [];
                
                $A.createComponent(
                    "aura:HTML",
                    { 
                        tag: "div"                        
                    },
                    function(newCmp) {                         
                        var array 	= document.getElementById(_id).getElementsByClassName( 'topic-container' );
                        _array 		= array;                       
                        
                        for(var i=0; i < _array.length; i++) {                            
                            var _item	= _array[i].getAttribute('data-value')	//Get data attribute 'data-value' from the element with the aura:id

                            //Check to make sure the new array doesn't contain the string value of the data attribute			
                            if (_attendance.indexOf(_item) === -1 && typeof _item !== 'undefined') {	
                                if (_columns){
                                    $( ".topic-container[data-value='" + _item + "']").wrapAll( "<div class='category' />");	//Wrap the articles in a div for 2 column styling
                                } else {
                                    $( ".topic-container[data-value='" + _item + "']").wrapAll( "<div />");
                                }                               
                                _attendance.push(_item);																	//Add the string to the array                	
                                var _group			= _elementArray[i].getElement();					//Get the article dom element inside each div
                                var _articleCount	= $(_group).siblings().length + 1;					//Get how many articles follow the first article in the group 
                                																		//then add 1 to include itself
                                $(_group).find('h1').append("<span>  (" + _articleCount + ")</span>");	//Set the number next to the topic name
                            }           
                        }
                    })
            }          
        }
    },
})