@isTest
public class RelatedIdeas_ApexController_test {
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
            //Create new account
            Account a = new Account(Name = 'Test Account');
            insert a;
            
            //Create new KB article
            general_article__kav k = 	new general_article__kav();
            k.Title = 					'APEX TEST';
            k.UrlName = 				'APEX-TEST';
            k.Language = 				'en_US';
            k.Topic__c = 				'Test';
            k.Keywords__c = 			'mobile, ezcare, donorperfect, test';
            insert k;
            
            //Create new KB article
            general_article__kav k2 = 	new general_article__kav();
            k2.Title = 					'Record Test';
            k2.UrlName = 				'Record-Test';
            k2.Language = 				'en_US';
            k2.Topic__c = 				'Records - Healthcare';
            insert k2;
            
            //Create new KB article
            How_To__kav k3 = 	new How_To__kav();
            k3.Title = 					'Cherry';
            k3.UrlName = 				'Cherry';
            k3.Language = 				'en_US';
            insert k3;
            
            //Set the value of the article
            k = [SELECT KnowledgeArticleId FROM general_article__kav WHERE Id = :k.Id];
            k2 = [SELECT KnowledgeArticleId FROM general_article__kav WHERE Id = :k2.Id];
            k3 = [SELECT KnowledgeArticleId FROM How_To__kav WHERE Id = :k3.Id];
            
            //Publish the article
            KbManagement.PublishingService.publishArticle(k.KnowledgeArticleId, true);
            KbManagement.PublishingService.publishArticle(k2.KnowledgeArticleId, true);
            KbManagement.PublishingService.publishArticle(k3.KnowledgeArticleId, true);
            
            // Prepare the ideas
            Idea idea1;
            Idea idea2;
            
            system.runAs(u1) {
                idea1 = TestDataFactory.createIdea('Idea One', 'DonorPerfect', 'Test');
                idea2 = TestDataFactory.createIdea('Idea Two', 'EZCare', 'EZ-Test');
            }       
            
            // Change the status of the ideas to be started
            list<Idea> ideas 	= new list<Idea>();
            idea1.Status 		= 'Started';
            idea1.Body 			= 'donorperfect is awesome, ezcare is great for testing stuff out.';
            idea2.Status 		= 'Started';
            ideas.add(idea1);
            ideas.add(idea2);
            
            //Run the Apex class
            RelatedIdeas_ApexController.getZones();
            RelatedIdeas_ApexController.getIdeas(k.Id, 'DonorPerfect', 5);
            RelatedIdeas_ApexController.getIdeas(k.Id, 'EZCare', 5);
            RelatedIdeas_ApexController.getIdeas(k2.Id, '', 5);
            RelatedIdeas_ApexController.getIdeas(k3.Id, '', 5);
            Test.stopTest();
        }
    }
}