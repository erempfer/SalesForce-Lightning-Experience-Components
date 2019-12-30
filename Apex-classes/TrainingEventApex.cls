public with sharing class TrainingEventApex {
    //Get the classes sign-up schedule from the SF object (the class schedule)
    @AuraEnabled
    public static List<Training_Event__c> getTrainingSchedule(String product){
        String thisProduct = product;
        // Set default value if product string is empty
        if (String.isEmpty(thisProduct)) {
            thisProduct = 'DonorPerfect';
        }
        
        List<Training_Event__c> theseClasses = [SELECT Id,  
                                                Class_Type__c, 
                                                Company_Owner__c,
                                                Date__c, 
                                                Description__c, 
                                                End_Date__c,
                                                Experience_Level__c,
                                                Full_Address__c,
                                                Hours__c, 
                                                Location__c,
                                                Max_registrants__c,
                                                Multi_Day_Discount__c,
                                                Name, 
                                                Product__c, 
                                                Rate__c, 
                                                Registration_Count__c,
                                                Topics__c, 
                                                Trainer__c, 
                                                What_to_Bring__c 
                                                FROM Training_Event__c
                                                WHERE Date__c >= TODAY AND Product__c = :thisProduct
                                                ORDER BY Date__c];
        
        //Loop through the fields in the query to check their values
        for (Training_Event__c classLoop : theseClasses) {
            if(classLoop.Multi_Day_Discount__c == NULL) {
                classLoop.Multi_Day_Discount__c = 0;		//If there's no value for the discount give it a value of 0
            }
            if(classLoop.End_Date__c == NULL) {
                classLoop.End_Date__c = classLoop.Date__c;	//If there's no value for the end date, set it as the start date
            }
            if(classLoop.Max_registrants__c == NULL) {
                classLoop.Max_registrants__c = 999999;		//If there's no value for the the max number of registrants, set it to a high number
            }
        }
        return theseClasses;
    }
    
    //Get the current user's information for the first checkbox
    @AuraEnabled
    public static User getCurrentUser() {
        User user = [SELECT Id, FirstName, LastName, Name, Email, Phone, 
                     User.Account.Phone, User.Account.Name, User.Account.ID, User.Account.Client_Id__c, User.Account.BillingState,
                     User.Contact.Id, User.Contact.Email, User.Contact.Phone, User.Contact.Language__c
                     FROM User WHERE Id=:UserInfo.getUserId()]; 
        return user;
    }
    
    //Get the other people's information whom the user can also register
    @AuraEnabled
    public static List<Contact> getContacts () {
        User thisUser = [SELECT Id, Name, User.Account.Name, User.Account.Id, User.Account.Client_Id__c FROM User WHERE Id=:UserInfo.getUserId()];         
        List<Contact> theseContacts = [SELECT Id, FirstName, LastName, Name FROM Contact WHERE Contact.AccountId=:thisUser.Account.Id AND active_inactive__c='Active' ORDER BY FirstName]; 
        return theseContacts;       
    }
    
    @AuraEnabled
    public static Decimal getCanadianTax () {
        String userProvince			= 'no state';
        Decimal cTax				= 0;
        List<CanadaTax__c> province = CanadaTax__c.getall().values();		//Custom Setting
        User user 					= [SELECT User.Account.BillingState FROM User WHERE Id=:UserInfo.getUserId()];  
        
        if (user.Account.BillingState != null) {							//Check to see if there is a billing state
            userProvince = string.valueOf(user.Account.BillingState); 		//Give the new value to the string
        }                      
        
        for (Integer i = 0; i < province.size(); i++) {						//Loop through the custom setting called Canadian
            if( province[i].Provinces__c.contains(userProvince) ){			//If there's a match
                cTax = province[i].Tax_Percent__c;
                //System.debug(cTax);
            }            
        }
        return cTax;
    }
    
    //Get the classes sign-up schedule from the SF object (the class schedule)
    @AuraEnabled
    public static List<Training_Event__c> getUpcomingClass(String product){
        String thisProduct = product;
        // Set default value if product string is empty
        if (String.isEmpty(thisProduct)) {
            thisProduct = 'DonorPerfect';
        }
        
        List<Training_Event__c> nextClass = [SELECT Id,  
                                             Date__c,                                                 
                                             Location__c,
                                             Name                                                
                                             FROM Training_Event__c
                                             WHERE Date__c >= TODAY AND Product__c = :thisProduct
                                             ORDER BY Date__c
                                             LIMIT 1];
        return nextClass;
    }
}