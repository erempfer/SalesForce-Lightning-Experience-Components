({
    rerender: function(cmp, helper) {
        this.superRerender(); 										//Calling superRerender() chains the rerendering to the components in the body attribute.
        //console.log('re-render');        
        var _hasTopic		= cmp.get("v.hasTopic");
        var _articleList	= cmp.get("v.articles");				//Get the articles attribute
        
        if (_articleList.length > 1) {            
            if (_hasTopic){            								//Run this code only if the article has a Topic__c field            
                var _topicList		= cmp.get("v.topic");   		//Get the topic attribute
                var _total			= _articleList.length - 1;                
                
                for(var i = 0; i < _articleList.length; i++){
                    var _article	= _articleList[i];
                    var _prevItem	= i - 1;						//Create a counter to move 1 place back in the list
                    if (_prevItem <= 0) { 
                        _prevItem = 0;
                    }
                    var _prevTopic	= _topicList[_prevItem];		//Get the object that is 1 place back from the current position in the article array
                    var _topicTitle	= cmp.find("top_title")[i];		//Find the title for the category using the aura:id and it's position in its array for multiple aura ids
                    
                    if (_article.Topic__c === _prevTopic.value && i != 0) { 	//Compare the current position in the article object list to the topic list
                        $A.util.addClass(_topicTitle, 'hideme');				//If they match hide the title, only display if it's a new category
                    }
                } 
            }
            helper.addDivJs(cmp);   
        }
    },
})