public class CommunityAlertsApexController {
    @AuraEnabled
    //public static List<AggregateResult> getAlertCount(String whatProduct, String whatObject, Integer howManyDays){  
    public static Map<String, String> getAlertCount(String whatProduct, String whatObject, Integer howManyDays){
        String	thisProduct 	= whatProduct;
        String	thisObject 		= whatObject; 
        Integer	thisManyDays	= howManyDays;
        
        List<AggregateResult> aggResultQuery	= new List<AggregateResult>();
   		List<KnowledgeArticleVersion> kbList 	= new List<KnowledgeArticleVersion>();
        List<RecentlyViewed> historyList 		= new List<RecentlyViewed>();
        List<RecentlyViewed> historyKBList		= new List<RecentlyViewed>();        
        Map<String, String> finalResult			= new Map<String, String>();
        
        //Fail safe if the product is left blank
        if(String.isBlank(thisProduct) || String.isEmpty(thisProduct)){
            thisProduct = 'DonorPerfect';
        }
        //Fail safe if the object is left blank
        if(String.isBlank(thisObject) || String.isEmpty(thisObject)){
            thisObject = 'None';
        } 
        //Fail safe if the number of days is left blank
        if(thisManyDays == null){
            thisManyDays = 5;
        }   
        
        //Create a value for the number of days to look back from today's day for the SOQL query to allow for a dynamic variable
        Date startDate = Date.today().addDays(-Integer.valueOf(thisManyDays));
        
        //Look for the alert count based on the Community topic chosen
        switch on thisObject {
            when 'Cases' {		
                aggResultQuery = [SELECT Count(Id) cnt
						  		  FROM Case
                          		  WHERE LastModifiedDate >= :startDate];
            }
            when 'Knowledgebase' {              
                String thisId = '';			//Create a blank variable to compare
                Boolean addMe = true;		//value to determine if the article was new and not viewed by the user
                Integer count = 0;			//final count number for how many articles are new and unseen by the user

                //Query for the user's view history of all objects in the past nth(start date) days
                historyList = [SELECT Id, Type 
                               FROM RecentlyViewed
                               WHERE LastViewedDate >= :startDate
                               ORDER BY LastViewedDate DESC]; 
                
                //Get a list of the recently published articles in the past nth(start date) days
                kbList = [SELECT Id, KnowledgeArticleId
                          FROM KnowledgeArticleVersion
                          WHERE LastPublishedDate >= :startDate];
                
                //Loop through history fields in the query to check their values and delete duplicate values               
                for (RecentlyViewed historyLoop : historyList) {
                    if(historyLoop.Type.contains('__ka')) {				//check to see if the type is an article (all article types end in __ka)	
                        if(String.valueOf(historyLoop.Id) != thisId) { 	//check to make sure it's not the same article	
                            historyKBList.add(historyLoop);				//add value to new list only if it's a new id
                            thisId = String.valueOf(historyLoop.Id);	//set the new value to compare id's to
                        }         
                    }
                }                
                //Loop through the article list and add final results to the temporary list
                for (KnowledgeArticleVersion kbLoop : kbList) {
                    //If both lists actually contain data
                    if(kbLoop.KnowledgeArticleId != null && historyList != null){
                        //Take each item in the KB list and loop through all the items in the history/recently viewed list
                        for(Integer i = 0; i < historyKBList.size() ; i++){
                            if(kbLoop.KnowledgeArticleId == historyKBList[i].Id){	//if the id's match
                                addMe = false; //do not add the item to the new list
                            }  
                        }
                        //If none of the recently published articles match the recently viewed articles 
                        //and the article type doesn't equal 'How To' add to the count
                        //The article type was added b/c CR science doesn't categorize their articles so it gives a false alert
                        if(addMe && kbLoop.ArticleType.countMatches('How_To') == 0) {
                            count = count + 1; // count number for    
                        }
                    }
                }  
                //Put the resulting count in the final map variable
                finalResult.put('cnt', String.valueOf(count));                
            }	
            when 'Groups' {	
                //Use the CollaborationGroupMembers so you can use the LastFeedDate to tell if the user saw the feed
                aggResultQuery = [SELECT Count(CollaborationGroupMember.CollaborationGroup.Name) cnt, CollaborationGroupMember.CollaborationGroup.Id
                           		  FROM CollaborationGroupMember
                          		  WHERE CollaborationGroupMember.CollaborationGroup.LastFeedModifiedDate >= :startDate AND LastFeedAccessDate <= :startDate
                          		  GROUP BY CollaborationGroupMember.CollaborationGroup.Id];
               }
            when 'Invoice' {
                aggResultQuery = [SELECT Count(Id) cnt
                          		  FROM Invoice__c
                          		  WHERE QB_Invoice_Balance__c > 0 AND (LastModifiedDate >= :startDate OR CreatedDate >= :startDate)];
            }
            when 'Training' {
                //The dropdown picklist values for the Training Event are DonorPerfect and EZ 
                if (thisProduct == 'EZCare') {thisProduct = 'EZ';}
                aggResultQuery = [SELECT Count(Id) cnt 
                          		  FROM Training_Event__c
                          		  WHERE (CreatedDate >= :startDate OR LastModifiedDate >= :startDate) AND Product__c = :thisProduct];
            }
        }   
        
        //Loop through the results list and add them to the mapping
        for(AggregateResult aggLoop : aggResultQuery)
        {
            finalResult.put('cnt', String.valueOf(aggLoop.get('cnt')));            
            if (aggLoop.Id != null) {
                finalResult.put('id', String.valueOf(aggLoop.get('Id')));
            }
        }
        
        return finalResult;
    }
}