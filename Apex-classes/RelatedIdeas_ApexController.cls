public with sharing class RelatedIdeas_ApexController {
	@AuraEnabled
    public static List<Community> getZones() {
        //Get the zone list (which product) for the Ideas
        List<Community> zoneList = [SELECT Id, Name FROM Community WHERE isActive = true];
        return zoneList;
    }
    
    @AuraEnabled
    public static List<Idea> getIdeas(String get_recordid, String product, Integer howMany) {
        // Declare variables
        List<Idea> getIdeas;
        List<List<Idea>> relatedIdeas;
        List<String> keyList;
        List<String> topicList;
        sObject results;
        String	keyWords		= '';
        String	topicName		= '';
        String	titleName		= '';
        String	wildCardChar	= '*';
        String	thisProduct 	= product;
        Integer	thisMany		= integer.valueof(howMany);
        Boolean	foundResults	= true;    
        String	theZoneID;
        String	dpofZoneId;
        
        // Set default value if product string is empty
        if (String.isEmpty(thisProduct)) {
            thisProduct = 'DonorPerfect';
        }
        // Set default value if howMany is empty
        if (thisMany == null) { thisMany = 3; }
        
        //Get the zone list (which product) for the Ideas
        List<Community> zoneList = [SELECT Id, Name FROM Community];
        
        //Loop through the fields in the query to set the zone ID value
        for (Community zoneLoop : zoneList) {
            if(zoneLoop.Name == thisProduct) {
                theZoneID = zoneLoop.Id;
            }
            if(zoneLoop.Name == 'DP Online Forms') {
                dpofZoneId = zoneLoop.Id;
            }
        }

        // Pulls article's standard fields - find all of the articles we need
        KnowledgeArticleVersion showArticle = [SELECT Id, KnowledgeArticleId, ArticleNumber, UrlName, ArticleType, Title, Summary, LastPublishedDate, PublishStatus 
                                               FROM KnowledgeArticleVersion
                                               WHERE Language ='en_US' AND PublishStatus ='Online' AND Id = :get_recordid
                                               LIMIT 1];
        
        // Grab the article type from showArticle (variable) so we can target the Topic__c, Title, and Keywords__c fields        
        String articleType = showArticle.ArticleType;

        // Grab the topic field, title, and keywords fields
        String queryString = 'SELECT Id, Title, Topic__c, Keywords__c FROM ' + articleType + ' WHERE Id = '+ '\'' + showArticle.Id + '\'';
        
        //Validation test in case the article type doesn't contain the keyword custom field
        try {
            results = database.query(queryString);
        } catch (QueryException qe) {
            foundResults = false;
        }                
        
        if (foundResults) {
            // Account for null values
            if(results.get('Keywords__c') != null){ 
                keyWords	= (String)results.get('Keywords__c');
                keyList 	= keyWords.split(', ');			//remove the comma in the keywords
                
                //Loop through the fields in the query to add wild cards to the terms
                for (Integer i = 0; i < keyList.size(); i++) {
    				keyList[i] = wildCardChar + keyList[i].toLowerCase() + wildCardChar;
				}
                keyWords = String.join(keyList, ' OR ');	//add OR to make the search terms broader
            } 
            if(results.get('Topic__c') != null){ 
                topicName 	= (String)results.get('Topic__c');
                topicList 	= topicName.split(' - ');		//remove the hyphen in the topic
                topicName = String.join(topicList, ' OR ').toLowerCase();	//add OR to make the search terms broader
            }
            if(results.get('Title') != null){ 
                titleName = (String) results.get('Title'); 
                titleName = titleName.toLowerCase();
            }
            
            //System.debug(keyWords);
            //System.debug(topicName);
            //System.debug(titleName);
        }         
        
        //SOSL statements evaluate to a list of lists of sObjects, where each list contains the search results for a particular sObject type. 
        //The result lists are always returned in the same order as they were specified in the SOSL query. If a SOSL query does not return 
        //any records for a specified sObject type, the search results include an empty list for that sObject.
        String searchTerms = '';
        if (String.isNotBlank(keyWords) || String.isNotEmpty(keyWords)) {
            searchTerms += keyWords;
        }
        if (String.isNotBlank(topicName) || String.isNotEmpty(topicName)) {
            if (String.isNotBlank(keyWords) || String.isNotEmpty(keyWords)) {
            	searchTerms += ' OR ' + topicName;
            } else {
                searchTerms += topicName;
            }            
        }
        //If there are no topics or keywords associated with the article, use its title as the search term
        if ((String.isBlank(keyWords) || String.isEmpty(keyWords)) && (String.isBlank(topicName) || String.isEmpty(topicName))) {
        	searchTerms += titleName;
        }
        //System.debug(searchTerms);
        String searchValue = '{' + searchTerms + '}';
        
        //Load DP Online Forms ideas too if the product is for DonorPerfect
        if (thisProduct == 'DonorPerfect') {
            relatedIdeas = [FIND :searchValue IN ALL FIELDS 
							RETURNING Idea (Id, Title, VoteTotal, Status, Body, CommunityId WHERE CommunityId =:theZoneID OR CommunityId =:dpofZoneId)                                         
                            Limit :thisMany];
        } else {
            relatedIdeas = [FIND :searchValue IN ALL FIELDS 
							RETURNING Idea (Id, Title, VoteTotal, Status, Body, CommunityId WHERE CommunityId =:theZoneID)                                         
                            Limit :thisMany];
        }        
        
        getIdeas = ((List<Idea>)relatedIdeas[0]);	//Create a single list from the list of lists. Array only has 1 object, Idea
        //System.debug(getIdeas);
        return getIdeas;
    }
}