
@isTest
public class DTMapping_ApexController_Test {
    static testMethod void testMappingInfo () {
        Test.startTest();
        
        //Set up user
        Profile pf = 	[Select Id from Profile where Name = 'System Administrator'];
        
        Account testAccount			= new Account();
        testAccount.Name			= 'Test Account';
        testAccount.BillingState	= 'QC';
        testAccount.BillingCountry	= 'Canada';
        insert testAccount;
        
        Contact cont 				= new Contact();
        cont.FirstName				= 'Test';
        cont.LastName				= 'Test';
        cont.Accountid				= testAccount.id;
        insert cont;
        
        User u1 = 		new User();         
        u1.FirstName = 						'Test';
        u1.LastName = 						'User';
        u1.Email = 							'testuser@test123456789.com';
        u1.CompanyName = 					'test.com';
        u1.Title = 							'Test User';
        u1.Username = 						'testuser@test123456789.com';
        u1.Alias = 							'testuser';
        u1.CommunityNickname = 				'Test User';
        u1.TimeZoneSidKey = 				'America/Mexico_City';
        u1.LocaleSidKey = 					'en_US';
        u1.EmailEncodingKey = 				'ISO-8859-1';
        u1.ProfileId = 						pf.Id;
        u1.LanguageLocaleKey = 				'en_US';
        u1.UserPermissionsKnowledgeUser = 	true;
        insert u1;
        
        //Run As U1
        System.RunAs(u1){ 
            
            Data_Services__c transfer1						= new Data_Services__c();  
            transfer1.Account__c 							= testAccount.id;
            transfer1.Account_Manager_Front_Line_Sales__c 	= 'Ed';
            transfer1.AM_FL_Sales_Email__c 					= 'test@softerware.com';
            transfer1.AM_FL_Sales_Phone__c 					= '555-555-5555';
            transfer1.Actual_Records__c 					= 10;   
            transfer1.Completion_Date__c 					= System.today() + 1; 
            transfer1.Data_Enhancements__c 					= 'NCOA/CASS';
            transfer1.Final_Data_Expected__c 				= System.today() + 5; 
            transfer1.Final_Data_Received__c 				= System.today() - 10;
            transfer1.IC_Email__c 							= 'test@softerware.com';
            transfer1.IC_Name__c 							= 'Ed';
            transfer1.IC_Phone__c 							= '555-555-5555';
            transfer1.Initial_Mapping__c 					= System.today() - 1;
            transfer1.Mapped_Fields__c 						= 10;
            transfer1.Mapping_Notes__c 						= 'Hi';
            transfer1.Marked_for_Deletion__c 				= null;
            transfer1.Max_Data_Transfer_Records__c 			= null;            
            insert transfer1;                    
            
            DTMapping_ApexController.getDTMappingInfo(transfer1.id);
            //DTMapping_ApexController.getDTMappingInfo('a0Ei000000VtddN');
        }
        Test.stopTest();
    }
    
    
    static testMethod void testAttachment () {  
        Test.startTest();  
        //Test account with attachment
        Account a = new Account(Name = 'Test Account');
        insert a;
        
        Contact c 	= new Contact();
        c.FirstName = 'Max';
        c.LastName	= 'Martin';
        c.AccountId	= a.id;
        insert c; 
        
        Data_Services__c ds 	= new Data_Services__c();
        ds.name 				= 'Data Transfer';
        ds.Account__c 			= a.id;
        ds.Primary_Contact__c 	= c.id;
        insert ds;
        
        Attachment attach	= new Attachment();   	
        attach.Name			= 'Mapping.txt';
        Blob bodyBlob		= Blob.valueOf('Donors\t \t \t \t \t\n \t (Data Source) Field Name\t DonorPerfect Screen\t DP Field\t Notes\n \t ID\t Main Screen\t DP Id\t This data will go to the OLD DONOR ID field in Donor Perfect.\n \t \t \t \t Extra notes here\n');
        attach.body			= bodyBlob;
        attach.parentId		= ds.id;
        insert attach;    
        
        //Test acount #2 with no attachment
        Account a2 = new Account(Name = 'Test Account 2');
        insert a2;
        
        Contact c2 		= new Contact();
        c2.FirstName 	= 'Dean';
        c2.LastName		= 'Martin';
        c2.AccountId	= a2.id;
        insert c2; 
        
        Data_Services__c ds2 	= new Data_Services__c();
        ds2.name 				= 'Data Transfer';
        ds2.Account__c 			= a2.id;
        ds2.Primary_Contact__c 	= c2.id;
        insert ds2;
        
        
        DTMapping_ApexController.getAttachedMapping(ds.id);
        DTMapping_ApexController.getAttachedMapping(ds2.id);
        Test.stopTest();
    }
}