({    
    // Gets all the articles from the KB
    getArticle: function(cmp){
        var action = cmp.get("c.getArticlesList");
        action.setParams({
            whichCase: cmp.get("v.theRecordId"),
        });
       
        action.setCallback(this, function(response){
            var state = response.getState();
            if (state === "SUCCESS") {
                cmp.set("v.articles", response.getReturnValue());    
                var myLength = cmp.get("v.articles").length; // get how many articles there are
                cmp.set("v.numOfArt", myLength); //set that number to display next to the header
            }          
        });
        $A.enqueueAction(action);
    },

	// Click the name of the article to navigate to it    
    gotoArticle: function(cmp, event){
        var whichPage = "/article/";
        var whichArticleId = event.target.getAttribute('data-id');
        var whichArticle = event.target.getAttribute('data-value');
        var myURL = whichPage.concat( whichArticleId.toString(), '/', whichArticle.toString());
        
        var urlEvent = $A.get("e.force:navigateToURL");
        urlEvent.setParams({
            "url": myURL
        });
        urlEvent.fire();                          
    },    
})