({    
    // Gets all the feature articles from the KB
    getArticle: function(cmp, event, helper){
        //debugger;
        var action = cmp.get("c.getArticlesList");
        action.setParams({
            whatType: 		cmp.get("v.articleType"),
            howMany: 		cmp.get("v.numOfArticles"),
            containsTopic:	cmp.get("v.hasTopic"),
            howToFilter:	cmp.get("v.filterHow"),
            topicFilter:	cmp.get("v.filterName"),
            keyWordFilter:	cmp.get("v.keyWordFilter")
        });
        
        action.setCallback(this, function(response){
            var state = response.getState();
            //console.log(state);
            if (state === "SUCCESS") {
                cmp.set("v.articles", response.getReturnValue());
                console.log(response.getReturnValue());
                var _hasTopic = cmp.get("v.hasTopic");					//Get value of the check box
                if (_hasTopic){											//If the has topic__c field is true                    
                    if(response.getReturnValue().length > 1) {			//If there is a return value that isn't null
                        var _articleList	= cmp.get("v.articles");	//Get the articles attribute that contains the KB article list object
                        var _topicList		= [];						//Create a blank array
                        var _count			= 0;						//Create a counter to tell the place in the array to compare
                        
                        for(var i=0; i < _articleList.length; i++){
                            var _article = _articleList[i];                            
                            _topicList.push({key:_count, value:_article.Topic__c});	//Push variables the article field and number into the array
                            _count = _count + 1;									//Increment the counter
                        }
                        cmp.set("v.topic", _topicList);                 //Fill the attribute topic with the array                        
                    }               
                } 
            } else if (state === "ERROR") {
                cmp.set("v.topicExists", false);
            }
        });
        $A.enqueueAction(action);
    },
    
    // Click the name of the article to navigate to it    
    gotoArticle: function(cmp, event){
        var whichPage 		= "/article/";
        var whichArticleId 	= event.target.getAttribute('data-id');
        var whichArticle 	= event.target.getAttribute('data-value');
        //var myURL 		= whichPage.concat( whichArticleId.toString(), '/', whichArticle.toString());     
        var myURL			= whichPage.concat(whichArticle.toString());
        var urlEvent 		= $A.get("e.force:navigateToURL");
        urlEvent.setParams({
            "url": myURL
        });
        urlEvent.fire();                          
    },    
    
    // Search for an article
    searchKeyChange: function(component, event) {
        var searchKey	= event.getParam("searchKey");
        //var action		= component.get("globalSearch");
        var action		= component.get("c.findBySearch");
        action.setParams({
            whatType: component.get("v.articleType"),
            "searchKey": searchKey
        });
        action.setCallback(this, function(a) {
            component.set("v.articles", a.getReturnValue());
        });
        $A.enqueueAction(action);
    },
    
    jsLoaded: function (component, event, helper) {
        if (window.jQuery) { 
            //console.log("jQuery loaded"); 
        }
    },
})