public with sharing class ArticleArchivesByType {
    @AuraEnabled
    public static List<KnowledgeArticleVersion> getArticlesList( String whatType, Integer howMany, Boolean containsTopic, String howToFilter, String topicFilter, String keyWordFilter ){        
        Integer thisMany = integer.valueof(howMany);        
        
        List<sObject> filteredList = new List<sObject>();              
        
        //Key word values for the articles displayed by topic. This is used for the EZ Explorers
        String keyWordLowerCase	= keyWordFilter.toLowerCase();
        if(string.isEmpty(keyWordLowerCase) || keyWordLowerCase == null || string.isBlank(keyWordLowerCase)) { keyWordLowerCase = ''; }        
        String[] kwArray		= keyWordLowerCase.split(', ');
        String topicLowerCase	= topicFilter.toLowerCase();
        
        //Final SOQL query string values for the articles by topic
        String queryStart	= 'SELECT Id, ArticleNumber, UrlName, ArticleType, Title, Summary, LastPublishedDate, PublishStatus, Topic__c, Keywords__c FROM ';
        String queryWhere	= ' WHERE Language = \'en_US\' AND PublishStatus = \'Online\'';
        String queryOrder	= ' ORDER BY Topic__c, Title, LastPublishedDate asc';
        String queryString	= queryStart + whatType + queryWhere + queryOrder;
        
        //Use this query to return all article types
        if(containsTopic == false){
            //Use this query to return articles of a specific type and displayed as a list
            return [SELECT Id, ArticleNumber, UrlName, ArticleType, Title, Summary, LastPublishedDate, PublishStatus 
                    FROM KnowledgeArticleVersion
                    WHERE Language ='en_US' AND PublishStatus ='Online' AND ArticleType =:whatType
                    ORDER BY LastPublishedDate desc LIMIT :thisMany]; 
            
        } else {
            //Query the entire catelog of articles from that template type
            list<sObject> results = database.query(queryString);            
            
            //Use this query to return a specific article type, cateogorize them by topic, and remove articles of a specific topic
            if (howToFilter == 'Remove articles with the topic...' && topicFilter !=''){                
                for(sObject kbList : results) {
                    //Check for null or blank values. Results will be null if the field is left blank in the article.
                    if(kbList.get('Topic__c') == null){ kbList.put('Topic__c', ''); }
                    if(kbList.get('Keywords__c') == null){ kbList.put('Keywords__c', ''); }
                    
                    String thisTopic	= (String)kbList.get('Topic__c');
                    String thisKeyWord	= (String)kbList.get('Keywords__c');
                    
                    //If the list DOES NOT contain the Topic, add it to the new list that we will return
                    if(!thisTopic.toLowerCase().contains(topicLowerCase)) {
                        //If the list contains any of the keywords add it to the new list that we will return
                        if(thisKeyWord.toLowerCase().contains(kwArray[0])) {
                            filteredList.add(kbList);
                        } else if (kwArray.size() > 1 && thisKeyWord.toLowerCase().contains(kwArray[1])) {
                            filteredList.add(kbList);
                        } else if (kwArray.size() > 2 && thisKeyWord.toLowerCase().contains(kwArray[2])) {
                            filteredList.add(kbList);
                        } else if (kwArray.size() > 3 && thisKeyWord.toLowerCase().contains(kwArray[3])) {
                            filteredList.add(kbList);
                        }
                    }
                }                 
                
                //Use this query to return a specific article type, cateogorize them by topic, and ONLY SHOW articles of a specific topic    
            } else if (howToFilter == 'Show ONLY articles with the topic...' && topicFilter !='') {  
                for(sObject kbList : results) {                      
                    //Check for null or blank values. Results will be null if the field is left blank in the article.
                    if(kbList.get('Topic__c') == null){ kbList.put('Topic__c', ''); }
                    if(kbList.get('Keywords__c') == null){ kbList.put('Keywords__c', ''); }                    
                    String thisTopic	= (String)kbList.get('Topic__c');
                    String thisKeyWord	= (String)kbList.get('Keywords__c');
                    
                    //If the list DOES contain the Topic, add it to the new list that we will return
                    if(thisTopic.toLowerCase().contains(topicLowerCase)) {
                        //If the list contains any of the keywords add it to the new list that we will return
                        if(thisKeyWord.toLowerCase().contains(kwArray[0])) {
                            filteredList.add(kbList);
                        } else if (kwArray.size() > 1 && thisKeyWord.toLowerCase().contains(kwArray[1])) {
                            filteredList.add(kbList);
                        } else if (kwArray.size() > 2 && thisKeyWord.toLowerCase().contains(kwArray[2])) {
                            filteredList.add(kbList);
                        } else if (kwArray.size() > 3 && thisKeyWord.toLowerCase().contains(kwArray[3])) {
                            filteredList.add(kbList);
                        }
                    }
                }              
                
                //Use this query to return a specific article type that contains ANY Topic and list them alphabetially by Topic      
            } else { 
                //Loop through all of the articles to find ones where the Keywords__c value contains the values in the property editor;
                //We got the error 'System.QueryException: field 'Keywords__c' can not be filtered in a query call' when we tried to use the string query call
                for(sObject kbList : results) {
                    //Check for null or blank values. Results will be null if the field is left blank in the article.
                    if(kbList.get('Keywords__c') == null){ kbList.put('Keywords__c', ''); }                    
                    String thisKeyWord	= (String)kbList.get('Keywords__c');

                    //If the list DOES contain ANY of the keywords, add it to the new list that we will return
                    if(thisKeyWord.toLowerCase().contains(kwArray[0])) {
                        filteredList.add(kbList);
                    } else if (kwArray.size() > 1 && thisKeyWord.toLowerCase().contains(kwArray[1])) {
                        filteredList.add(kbList);
                    } else if (kwArray.size() > 2 && thisKeyWord.toLowerCase().contains(kwArray[2])) {
                        filteredList.add(kbList);
                    } else if (kwArray.size() > 3 && thisKeyWord.toLowerCase().contains(kwArray[3])) {
                        filteredList.add(kbList);
                    }
                }                
            }
        }
        //Return the filtered list by keywords because we cannot use Long Text fields to filter in a String Query 
        return filteredList; 
    }    
    
    
    @AuraEnabled
    public static List<KnowledgeArticleVersion> findBySearch( String searchKey, String whatType ) {        
        String searchWord = '%' + searchKey + '%';
        return [SELECT Id, ArticleNumber, UrlName, ArticleType, Title, Summary, LastPublishedDate, PublishStatus  
                FROM KnowledgeArticleVersion 
                WHERE Language ='en_US' AND PublishStatus ='Online' AND ArticleType =:whatType AND (Title LIKE :searchWord OR Summary Like :searchWord)];
    }    
    
    
    @AuraEnabled
    public static List<KnowledgeArticleVersion> globalSearch( String searchKey, String whatType ) {
        String searchVar	= '{' + searchKey + '}';
        String whichArticle	= whatType;
        
        List<List<SObject>> articles = [FIND :searchVar 
                                        RETURNING KnowledgeArticleVersion (Id, Title, Summary, UrlName, LastPublishedDate, ArticleNumber, ArticleType 
                                                                           WHERE PublishStatus='online' 
                                                                           AND Language = 'en_US' AND ArticleType IN (:whichArticle))]; 
        
        //Create a single list from the list of lists. Array only has 1 object, KnowlegeArticleVersion
        List<KnowledgeArticleVersion> singleList = ((List<KnowledgeArticleVersion>)articles[0]);	
        return singleList;
    }
}