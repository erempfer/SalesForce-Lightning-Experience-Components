public with sharing class KBArticleIconApexController {
    @AuraEnabled
    public static String getKeyWords(String get_recordid) {    
        String 		keyWords 		= 'none';
        Boolean 	foundResults 	= true;
        sObject 	results;
        
        // Pulls article's standard fields - find all of the articles we need
        KnowledgeArticleVersion showArticle = [SELECT Id, KnowledgeArticleId, ArticleNumber, UrlName, ArticleType, Title, Summary, LastPublishedDate, PublishStatus 
                                               FROM KnowledgeArticleVersion
                                               WHERE Language ='en_US' AND PublishStatus ='Online' AND Id = :get_recordid
                                               LIMIT 1];
        
        //The keywords field is not in DPMobile, Featured and is called a different field in How To "Key_Words__c"
        // Grab the article type from showArticle (variable) so we can target the Keywords__c 
        String articleType = showArticle.ArticleType;
        
        // Grab the Keywords fields and compare it to Article_Link__c 'Name'
        String queryString	= 'SELECT Id, Keywords__c FROM ' + articleType + ' WHERE Id = '+ '\'' + showArticle.Id + '\'';
        
        //Validation test in case the article type doesn't contain the keyword custom field
        try {
            results = database.query(queryString);
        } catch (QueryException qe) {
            foundResults = false;
        }                
        
        if (foundResults) {
            // Get string value of field
            //System.debug(results.get('Keywords__c'));
            if(results.get('Keywords__c') == null){
                results.put('Keywords__c', 'none');                
            }   
            keyWords = (String) results.get('Keywords__c');
        }  
        
        //System.debug(keyWords);
        return keyWords;
    }
}