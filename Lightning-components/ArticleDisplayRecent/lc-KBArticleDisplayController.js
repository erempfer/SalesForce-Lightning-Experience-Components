({    
    // Gets all the articles from the KB
    getArticle: function(cmp, event, helper){
        helper.getMostRecentJs(cmp, event);
                
        //Change Product Style
        var _product = 	cmp.get("v.whichProduct");
        var cmpTarget = cmp.find("kb-articles");        
        if (_product == "DonorPerfect"){            
            $A.util.addClass(cmpTarget , 'dp-style');
        }
    },
    
    // Click the name of the article to navigate to it    
    gotoArticle: function(cmp, event){
        var whichPage 		= "/article/";
        var whichArticleId 	= event.target.getAttribute('data-id');
        var whichArticle 	= event.target.getAttribute('data-value');
        //var myURL 		= whichPage.concat( whichArticleId.toString(), '/', whichArticle.toString());
        var myURL 			= whichPage.concat(whichArticle.toString());
        
        var urlEvent = $A.get("e.force:navigateToURL");
        urlEvent.setParams({
            "url": myURL
        });
        urlEvent.fire();                          
    },    
    
    // Search for an article
    searchKeyChange: function(component, event, helper) {
        var searchKey = event.getParam("searchKey");
        if (searchKey === null || searchKey === "") {
            helper.getMostRecentJs(component, event);
        } else {
            helper.getArticlesJs(component, event);
        }        
    },
    
    showSpinner : function(component,event,helper){
        // display spinner when aura:waiting (server waiting)
        component.set("v.toggleSpinner", true);  
    },
    
    hideSpinner : function(component,event,helper){
        // hide when aura:downwaiting
        component.set("v.toggleSpinner", false);
    },
})