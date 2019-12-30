public with sharing class ArticleLinksApexController {
    @AuraEnabled
    public static List<SObject> getArticle(String get_recordid, String product) {
        // Declare variables
        List<sObject> getLinks;        
        String thisProduct = product;
        
        // Set default value if product string is empty
        if (String.isEmpty(thisProduct)) {
        	thisProduct = 'DonorPerfect';
        }
        
        // Pulls article's standard fields - find all of the articles we need
        KnowledgeArticleVersion showArticle = [SELECT Id, KnowledgeArticleId, ArticleNumber, UrlName, ArticleType, Title, Summary, LastPublishedDate, PublishStatus 
                                               FROM KnowledgeArticleVersion
                                               WHERE Language ='en_US' AND PublishStatus ='Online' AND Id = :get_recordid /*KnowledgeArticleId = :get_recordid*/
                                               LIMIT 1];
        
        // Grab the article type from showArticle (variable) so we can target the Topic__c field        
        String articleType = showArticle.ArticleType;
        
        // Grab the topic fields and compare it to Article_Link__c 'Name'
        String queryString 		= 'SELECT Id, Topic__c FROM ' + articleType + ' WHERE Id = '+ '\'' + showArticle.Id + '\'';
        sObject results 		= database.query(queryString);
        
        // Get string value of field
        String topicName 		= (String) results.get('Topic__c');
        
        // Pull all of the records from the Object
        List<sObject> records	= [SELECT Id, Name, Related_Information__c, Related_Video__c, Related_Other__c
                                  FROM Article_Link__c];
        
        // If there are records loop through them and find the matching topic and product fields
        if (records.size() > 0){
            for (Integer i = 0; i < records.size(); i++) {
                if( records[i].get('Name') == topicName) {
                    getLinks = [SELECT Id, Name, Related_Information__c, Related_Video__c, Related_Other__c
                                FROM Article_Link__c
                                WHERE Name = :topicName AND Product__c = :thisProduct
                                LIMIT 1];
                }       
            }
        }
        
        return getLinks;
    }
}