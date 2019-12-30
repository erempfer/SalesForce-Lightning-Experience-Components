@isTest
public class KBArticleIconApexController_Test {
    static testMethod void test1 () {
        Test.startTest();
        
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
        
        //Run As U1
        System.RunAs(u1){             
            //System.debug('something something');
            
            //Create new account
            Account a = new Account(Name = 'Test Account');
            insert a;
            
            //Create new KB article
            general_article__kav k = 	new general_article__kav();
            k.Title = 					'APEX TEST';
            k.UrlName = 				'APEX-TEST';
            k.Language = 				'en_US';
            k.Keywords__c = 			'Test, casey fields';
            insert k;
            
            //Create new KB article
            Featured__kav f = 			new Featured__kav();
            f.Title = 					'APEX TEST 2';
            f.UrlName = 				'APEX-TEST-2';
            f.Language = 				'en_US';
            insert f;
            
                        //Create new KB article
            How_To__kav h = 			new How_To__kav();
            h.Title = 					'APEX TEST 3';
            h.UrlName = 				'APEX-TEST-3';
            h.Language = 				'en_US';
            insert h;
            
            //Set the value of the article
            k = [SELECT KnowledgeArticleId FROM general_article__kav WHERE Id = :k.Id];    
            //Publish the article
            KbManagement.PublishingService.publishArticle(k.KnowledgeArticleId, true);

			//Set the value of the article
            f = [SELECT KnowledgeArticleId FROM Featured__kav WHERE Id = :f.Id];    
            //Publish the article
            KbManagement.PublishingService.publishArticle(f.KnowledgeArticleId, true);
            
            //Set the value of the article
            h = [SELECT KnowledgeArticleId FROM How_To__kav WHERE Id = :h.Id];    
            //Publish the article
            KbManagement.PublishingService.publishArticle(h.KnowledgeArticleId, true);
            
            //Run the Apex class
            KBArticleIconApexController.getKeyWords(k.Id);
            KBArticleIconApexController.getKeyWords(f.Id);
            KBArticleIconApexController.getKeyWords(h.Id);
            
            Test.stopTest();
        }
    }
}