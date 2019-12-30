({
    getMostRecentJs: function(cmp, event) {
        var action = cmp.get("c.getMostRecent");
        action.setParams({
            howMany: cmp.get("v.numOfArticles"),
            isPublic: cmp.get("v.isPublic")
        });
        
        action.setCallback(this, function(response){
            var state = response.getState();
            if (state === "SUCCESS") {
                cmp.set("v.articles", response.getReturnValue());              
            }          
        });
        $A.enqueueAction(action);
    },   
    
    getArticlesJs: function(component, event) {
        var _searchKey = event.getParam("searchKey");             
        var action = component.get("c.globalArticleSearch");
        action.setParams({
            searchKey	: _searchKey,
            howMany		: component.get("v.numOfArticles"),
            isPublic	: component.get("v.isPublic")
        });
        action.setCallback(this, function(response){
            var state = response.getState();
            if (state === "SUCCESS") {
                component.set("v.articles", response.getReturnValue());  
                console.log("v.articles");
            }               
        });
        $A.enqueueAction(action);
    },  
})