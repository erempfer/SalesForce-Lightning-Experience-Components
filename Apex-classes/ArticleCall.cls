public with sharing class ArticleCall {
    @AuraEnabled
    public static List<KnowledgeArticleVersion> getKAVList(){        
        return [SELECT Id, Title, Summary, UrlName, LastPublishedDate, ArticleNumber, ArticleType, PublishStatus  
                FROM KnowledgeArticleVersion 
                WHERE Language ='en_US' AND PublishStatus ='Online'
                ORDER BY LastPublishedDate desc];    
    } 
    
    @AuraEnabled
    public static List<KnowledgeArticleVersion> getMostRecent(Integer howMany, Boolean isPublic){
        Integer thisMany	= integer.valueof(howMany); 
        Boolean	publicOn	= isPublic;
        List<KnowledgeArticleVersion> kbList;
        
        if( thisMany == null){ thisMany = 20; }
        if ( publicOn == null ) { publicOn = false; }
        
        if(publicOn){
            kbList = [SELECT Id, Title, Summary, UrlName, LastPublishedDate, ArticleNumber, ArticleType, PublishStatus  
                      FROM KnowledgeArticleVersion 
                      WHERE Language ='en_US' AND PublishStatus ='Online' AND ArticleType IN ('DPMobile__kav',
                                                                                              //'FAQ__kav',                                                                                              
                                                                                              'Featured__kav', 
                                                                                              //'Fix_Bug_Error_Articles__kav',
                                                                                              'general_article__kav',
                                                                                              //'How_To__kav',
                                                                                              //'Information__kav',
                                                                                              'Table__kav',
                                                                                              'Video_Feature__kav')
                      ORDER BY LastPublishedDate desc LIMIT :thisMany];
        } else {
            kbList = [SELECT Id, Title, Summary, UrlName, LastPublishedDate, ArticleNumber, ArticleType, PublishStatus  
                      FROM KnowledgeArticleVersion 
                      WHERE Language ='en_US' AND PublishStatus ='Online' AND ArticleType IN ('DPMobile__kav',
                                                                                              //'FAQ__kav',
                                                                                              'Featured__kav', 
                                                                                              //'Fix_Bug_Error_Articles__kav',
                                                                                              'general_article__kav',
                                                                                              //'How_To__kav',
                                                                                              //'Information__kav', 
                                                                                              'Release_Notes__kav',
                                                                                              'Table__kav',
                                                                                              'Video_Feature__kav')
                      ORDER BY LastPublishedDate desc LIMIT :thisMany];
        }
        return kbList;    
    }       
    
    @AuraEnabled
    public static List<KnowledgeArticleVersion> findBySearch(String searchKey) {
        String searchWord = '%' + searchKey + '%';
        return [SELECT Id, Title, Summary, UrlName, LastPublishedDate, ArticleNumber, ArticleType, PublishStatus  
                FROM KnowledgeArticleVersion 
                WHERE Language ='en_US' AND PublishStatus ='Online' AND (Title LIKE :searchWord OR Summary Like :searchWord)];
    }
    
    @AuraEnabled
    public static List<KnowledgeArticleVersion> globalArticleSearch(String searchKey, Integer howMany, Boolean isPublic) {
        String	searchVar	= '{' + searchKey + '}';
        Integer	thisMany	= integer.valueof(howMany);        
        Boolean	publicOn	= isPublic; 
        List<List<SObject>> articles;
        
        if ( thisMany == null){ thisMany = 8; }
        if ( publicOn == null ) { publicOn = false; }
        
        
        //SOSL statements evaluate to a list of lists of sObjects, where each list contains the search results for a particular sObject type. 
        //The result lists are always returned in the same order as they were specified in the SOSL query. If a SOSL query does not return 
        //any records for a specified sObject type, the search results include an empty list for that sObject.
        if(publicOn){
            articles = [FIND :searchVar 
                        RETURNING KnowledgeArticleVersion (Id, Title, Summary, UrlName, LastPublishedDate, ArticleNumber, ArticleType 
                                                           WHERE PublishStatus='online' 
                                                           AND Language = 'en_US' AND ArticleType IN ('DPMobile__kav',
                                                                                                      'FAQ__kav',
		                                                                                              'Featured__kav', 
                                                                                              		  'Fix_Bug_Error_Articles__kav',
                                                                                              		  'general_article__kav',
                                                                                                      'How_To__kav',
                                                                                                      'Information__kav',
                                                                                                      'Table__kav',
                                                                                                      'Video_Feature__kav')) 
                        LIMIT :thisMany];
        } else {
            articles = [FIND :searchVar 
                        RETURNING KnowledgeArticleVersion (Id, Title, Summary, UrlName, LastPublishedDate, ArticleNumber, ArticleType 
                                                           WHERE PublishStatus='online' 
                                                           AND Language = 'en_US' AND ArticleType IN ('DPMobile__kav',
                                                                                                      'FAQ__kav',
                                                                                                      'Featured__kav', 
                                                                                                      'Fix_Bug_Error_Articles__kav',
                                                                                                      'general_article__kav',
                                                                                                      'How_To__kav',
                                                                                                      'Information__kav', 
                                                                                                      'Release_Notes__kav',
                                                                                                      'Table__kav',
                                                                                                      'Video_Feature__kav')) 
                        LIMIT :thisMany];
        }
        
        List<KnowledgeArticleVersion> singleList = ((List<KnowledgeArticleVersion>)articles[0]);	//Create a single list from the list of lists. Array only has 1 object, KnowlegeArticleVersion
        return singleList;
    }
}