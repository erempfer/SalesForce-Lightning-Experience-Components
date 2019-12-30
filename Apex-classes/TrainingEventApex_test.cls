@isTest
public class TrainingEventApex_test {
    static testMethod void test1 () {
        TrainingEventApex.getCurrentUser();
        TrainingEventApex.getContacts();
        TrainingEventApex.getUpcomingClass('DonorPerfect');
        TrainingEventApex.getUpcomingClass('');
    }
    
    static testMethod void test2 () {
        Profile pf = [Select Id from Profile where Name = 'SofterWare DP Community User'];
        
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
        
        User user 					= new User();
        user.Username 				= 'testemail@test.com';
        user.Email	 				= 'testemail@test.com';
        user.Alias					= 'Alias123';
        user.LastName 				= 'LastTestName';
        user.ContactId				= cont.Id;
        user.CommunityNickname 		= 'Test User';
        user.TimeZoneSidKey 		= 'America/Mexico_City';
        user.LocaleSidKey 			= 'en_US';
        user.EmailEncodingKey 		= 'ISO-8859-1';
        user.ProfileId 				= pf.Id;
        user.LanguageLocaleKey 		= 'en_US';
        insert user;
        
        CanadaTax__c cTax1 			= new CanadaTax__c();
        cTax1.Name					= 'MB,AB';
        cTax1.Provinces__c			= 'MB,AB';
        cTax1.Tax_Percent__c		= 0.05000;
        insert cTax1;
        
        CanadaTax__c cTax2 			= new CanadaTax__c();
        cTax2.Name					= 'SK,BC,QC';
        cTax2.Provinces__c			= 'SK,BC,QC';
        cTax2.Tax_Percent__c		= 0.75;
        insert cTax2; 
        
        System.runAs(user)
        {
            TrainingEventApex.getCanadianTax();
        }       		
    }
    
    static testMethod void test3 () {
        //Set up user
        Profile pf = 	[Select Id from Profile where Name = 'System Administrator'];
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
        
        Training_Event__c class1	= new Training_Event__c();
        class1.Class_Type__c		= 'Classroom';
        class1.Company_Owner__c		= 'SofterWare';
        class1.Date__c				= System.today();
        class1.Description__c		= 'Class Details';
        class1.End_Date__c			= System.today() + 1;
        class1.Experience_Level__c	= 'Experienced Users';
        class1.Full_Address__c		= '101 Street';
        class1.Hours__c				= '8-5pm';
        class1.Location__c			= 'Philadelphia, PA';
        class1.Multi_Day_Discount__c= 50;
        class1.Name 				= 'DP 101';
        class1.Product__c			= 'DonorPerfect';
        class1.Rate__c				= 50;
        class1.Topics__c			= 'Many';
        class1.Trainer__c			= u1.Id;
        class1.What_to_Bring__c 	= 'Laptop';
        insert class1;
        
        Training_Event__c class2	= new Training_Event__c();
        class2.Class_Type__c		= 'Virtual Class';
        class2.Company_Owner__c		= 'SofterWare';
        class2.Date__c				= System.today() + 5;
        class2.Description__c		= 'Class Details';
        class2.End_Date__c			= System.today() + 7;
        class2.Experience_Level__c	= 'Experienced Users';
        class2.Full_Address__c		= '101 Street';
        class2.Hours__c				= '8-5pm';
        class2.Location__c			= 'Philadelphia, PA';
        class2.Multi_Day_Discount__c= 100;
        class2.Name 				= 'EZCare 101';
        class2.Product__c			= 'EZ';
        class2.Rate__c				= 200;
        class2.Topics__c			= 'Many';
        class2.Trainer__c			= u1.Id;
        class2.What_to_Bring__c 	= 'Laptop';
        insert class2;
        
        Training_Event__c class3	= new Training_Event__c();
        class3.Class_Type__c		= 'Classroom';
        class3.Company_Owner__c		= 'DPC';
        class3.Date__c				= System.today() + 5;
        class3.Description__c		= 'Class Details';
        class3.End_Date__c			= NULL;
        class3.Experience_Level__c	= 'Experienced Users';
        class3.Full_Address__c		= '101 Street';
        class3.Hours__c				= '8-5pm';
        class3.Location__c			= 'Philadelphia, PA';
        class3.Multi_Day_Discount__c= NULL;
        class3.Name 				= 'Canada DP 101';
        class3.Product__c			= 'DonorPerfect';
        class3.Rate__c				= 200;
        class3.Topics__c			= 'Many';
        class3.Trainer__c			= u1.Id;
        class3.What_to_Bring__c 	= 'Laptop';
        insert class3;
        
        //Run As U1
        System.RunAs(u1){        
            //TrainingEventApex.getTrainingSchedule('DonorPerfect');
            //TrainingEventApex.getTrainingSchedule('');
            
            // Test Coverage for getTrainingSchedule method
            Decimal MDD;
            Date ED;            
            List <Training_Event__c> ab =  TrainingEventApex.getTrainingSchedule('');
            for (Training_Event__c abc :ab){
                MDD=abc.Multi_Day_Discount__c;
                ED=abc.End_Date__c;
            }
            system.assertEquals(0,MDD);
            system.assertEquals(System.today() + 5,ED);            
        }
    }
}