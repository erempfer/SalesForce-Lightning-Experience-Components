public with sharing class IdeaDashboard {
    @AuraEnabled
    public static List<DataSet> getAllIdeasByStatus(String whatZone){  
        String theZone 		= whatZone;
        String theZoneID;
        String dpofZoneId;
        String dpZone 		= 'DonorPerfect';
        String dpofZone 	= 'DP Online Forms';
        List<AggregateResult> result;
        
        //Fail safe if the zone is left blank
        if ( String.isBlank(theZone) || String.isEmpty(theZone)){
            theZone = dpZone;
        }
        //Get the zone list (which product) for the Ideas
        List<Community> zoneList = [SELECT Id, Name FROM Community];
        
		//Loop through the fields in the query to set the zone ID value
        for (Community zoneLoop : zoneList) {
            if(zoneLoop.Name == theZone) {
                theZoneID = zoneLoop.Id;
            }
            if(zoneLoop.Name == dpofZone) {
                dpofZoneId = zoneLoop.Id;
            }
        }        
        
        //Get the Ideas count for each status filtered by zone/product 
        //Load DP Online Forms ideas too if the product is for DonorPerfect
        if (theZone == dpZone) {
            result = [SELECT Count(Id) cnt, Status 
                      FROM Idea 
                      WHERE CommunityId =:theZoneID OR CommunityId =:dpofZoneId
                      GROUP BY Status];
        } else {
            //Return the top voted ideas 
            result = [SELECT Count(Id) cnt, Status 
                      FROM Idea 
                      WHERE CommunityId =:theZoneID 
                      GROUP BY Status]; 
        }           
        
        //Put the list results into a data set
        List<DataSet> dataSet = new List<DataSet>();
        for(AggregateResult ar : result){
            String status = (String)ar.get('Status');
            Integer total = (Integer)ar.get('cnt'); 
            dataSet.add(new DataSet(status, total));                       
        }
        //System.debug('dataSet' + dataSet);
        return dataSet ; 
    }
    
    public class DataSet{
        public DataSet(String label ,Integer count){
            this.label = label ; 
            this.count = count ;
        }
        @AuraEnabled
        public String label {get;set;}
        @AuraEnabled
        public Integer count {get;set;}        
    }

    @AuraEnabled
    public static List<Idea> getTopIdeasAP(String whatZone, Integer howMany){  
        String 	theZone 	= whatZone;
        String 	theZoneID;
        String	dpofZoneId;
        String 	dpZone 		= 'DonorPerfect';
        String 	dpofZone 	= 'DP Online Forms';
        String	statDone	= 'Completed';
        String	statNo		= 'Declined';
        Integer thisMany	= integer.valueof(howMany);
		List<Idea> result;
        
        if( thisMany == null){ thisMany = 5; }
        
        //Fail safe if the zone is left blank
        if ( String.isBlank(theZone) || String.isEmpty(theZone)){
            theZone = dpZone;
        }
        
        //Get the zone list (which product) for the Ideas
        List<Community> zoneList = [SELECT Id, Name FROM Community];
        
		//Loop through the fields in the query to set the zone ID value
        for (Community zoneLoop : zoneList) {
            if(zoneLoop.Name == theZone) {
                theZoneID = zoneLoop.Id;
            }
            if(zoneLoop.Name == dpofZone) {
                dpofZoneId = zoneLoop.Id;
            }
        }
        
        //Return the top voted ideas 
        //Load DP Online Forms ideas too if the product is for DonorPerfect
        if (theZone == dpZone) {
            result = [SELECT Id, Title, VoteTotal, Status, CommunityId, NumComments, IsMerged
                      FROM Idea 
                      WHERE (CommunityId =:theZoneID OR CommunityId =:dpofZoneId) AND (Status != :statDone AND Status != :statNo) AND IsMerged = false
                      ORDER BY LastCommentDate DESC NULLS LAST
                      LIMIT :thisMany];
        } else {
            //Return the top voted ideas 
            result = [SELECT Id, Title, VoteTotal, Status, CommunityId, NumComments, IsMerged 
                      FROM Idea 
                      WHERE CommunityId =:theZoneID AND (Status != :statDone AND Status != :statNo) AND IsMerged = false 
                      ORDER BY LastCommentDate DESC NULLS LAST
                      LIMIT :thisMany]; 
        }         
        return result;
    }    

    @AuraEnabled
    public static List<List<String>> hasVoted(List<String> ideaId){
        Boolean votedOn 				= false;
        List<String> whichId 			= ideaId;
        List<List<String>> didVote		= new List<List<String>>();
        
        //Loop through all of the IDs and see if the user voted on it
        for(String thisId : whichId) {
            List<String> tempList = new List<String>();
            //Grab the vote record a result will appear if the vote was on the idea and by the current user
            List<Vote> hasVoted	= [Select Type from Vote Where ParentId =:thisId AND CreatedById =:UserInfo.getUserId() LIMIT 1];
            //Set the value to true and include the 'Up' or 'Down' status for highlighting the buttons on the idea leaderboard
            if (hasVoted.size() > 0) {
                tempList.add('true');
                tempList.add(hasVoted[0].Type);
            } else {
                tempList.add('false');
                tempList.add('no votes');
            }  
            didVote.add(tempList);
        }
        //system.debug('User has voted on this: ' + didVote);
        return didVote;
    }
    
    @AuraEnabled
    public static String saveVote(String ideaId, String voteType){
        //Create a new vote and give it the parameters of where to go and whether it's an up or down vote
        Vote newVote 		= new Vote();
        newVote.ParentId 	= ideaId;
        newVote.Type 		= voteType;
        try{
            insert newVote;
        } catch(DmlException e) {
            ApexPages.addmessage(new ApexPages.Message(ApexPages.Severity.WARNING, e.getMessage()));
        }        
        return newVote.Id;
    }
    
    @AuraEnabled
    public static List<Community> getZones() {
        //Get the zone list (which product) for the Ideas
        List<Community> zoneList = [SELECT Id, Name FROM Community WHERE isActive = true];
        return zoneList;
    }
}