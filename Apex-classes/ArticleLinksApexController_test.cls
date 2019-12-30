@isTest
public class ArticleLinksApexController_Test {
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
            
            System.debug('something something');
            
            //Create new account
            Account a = new Account(Name = 'Test Account');
            insert a;
            
            //Create new KB article
            general_article__kav k = 	new general_article__kav();
            k.Title = 					'APEX TEST';
            k.UrlName = 				'APEX-TEST';
            k.Language = 				'en_US';
            k.Topic__c = 				'Test';
            insert k;
            
            //Set the value of the article
            k = 						[SELECT KnowledgeArticleId FROM general_article__kav WHERE Id = :k.Id];    
            //Publish the article
            KbManagement.PublishingService.publishArticle(k.KnowledgeArticleId, true);
            
            //Create new Article Link Object
            Article_Link__c al = new Article_Link__c();
            al.Name 					= 'Test';
            al.Product__c				= 'DonorPerfect';
            al.Related_Information__c 	= 'Working';
            al.Related_Video__c 		= 'Working2';
            insert al;
            
            //Run the Apex class
            ArticleLinksApexController.getArticle(k.Id, 'DonorPerfect');
            ArticleLinksApexController.getArticle(k.Id, '');
            
            Test.stopTest();
        }
    }
}