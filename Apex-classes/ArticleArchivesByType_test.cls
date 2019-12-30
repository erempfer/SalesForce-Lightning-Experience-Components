@isTest
public class ArticleArchivesByType_test {
    static testMethod void ArticleArchivesByTypeTester () {
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
            Featured__kav f = 			new Featured__kav();
            f.Title = 					'Feature 1';
            f.UrlName = 				'Feature-1';
            f.Language = 				'en_US';
            f.Summary = 				'How to post tuition.';
            f.Topic__c =				'Tuition Posting';
            f.Keywords__c = 			'magnus';            
            insert f;
            
            //Create new KB article NO TOPIC OR KEYWORD
            Featured__kav f2 = 			new Featured__kav();
            f2.Title = 					'Feature 2';
            f2.UrlName = 				'Feature-2';
            f2.Language = 				'en_US';
            f2.Summary = 				'This is a summary for the article.';
            insert f2;
            
            //Create new KB article
            Featured__kav f3 = 			new Featured__kav();
            f3.Title = 					'Feature 3';
            f3.UrlName = 				'Feature-3';
            f3.Language = 				'en_US';
            f3.Summary = 				'This is a summary for the article.';
            f3.Topic__c =				'Registration';
            insert f3;
            
            //Create new KB article
            Featured__kav f4 = 			new Featured__kav();
            f4.Title = 					'Feature 4';
            f4.UrlName = 				'Feature-4';
            f4.Language = 				'en_US';
            f4.Summary = 				'This is a summary for the article.';
            f4.Topic__c =				'Tuition Posting';
            f4.Keywords__c = 			'peter';
            insert f4;
            
            //Create new KB article
            Featured__kav f5 = 			new Featured__kav();
            f5.Title = 					'Feature 5';
            f5.UrlName = 				'Feature-5';
            f5.Language = 				'en_US';
            f5.Summary = 				'This is a summary for the article.';
            f5.Topic__c =				'Tuition Posting';
            f5.Keywords__c = 			'paul';
            insert f5;            
            
            //Create new KB article
            Featured__kav f6 = 			new Featured__kav();
            f6.Title = 					'Feature 6';
            f6.UrlName = 				'Feature-6';
            f6.Language = 				'en_US';
            f6.Summary = 				'This is a summary for the article.';
            f6.Topic__c =				'Tuition Posting';
            f6.Keywords__c = 			'Mary';
            insert f6;
            
            //Create new KB article
            DPMobile__kav m = 			new DPMobile__kav();
            m.Title = 					'Mobile';
            m.UrlName = 				'Mobile';
            m.Language = 				'en_US';
            m.Summary = 				'This is a summary for the article.';
            m.Topic__c =				'Using Mobile';
            insert m;
            
            //Set the value of the article
            f = [SELECT KnowledgeArticleId FROM Featured__kav WHERE Id = :f.Id];    
            //Publish the article
            KbManagement.PublishingService.publishArticle(f.KnowledgeArticleId, true);
            
            //Set the value of the article
            f2 = [SELECT KnowledgeArticleId FROM Featured__kav WHERE Id = :f2.Id];    
            //Publish the article
            KbManagement.PublishingService.publishArticle(f2.KnowledgeArticleId, true);
            
            //Set the value of the article
            f3 = [SELECT KnowledgeArticleId FROM Featured__kav WHERE Id = :f3.Id];    
            //Publish the article
            KbManagement.PublishingService.publishArticle(f3.KnowledgeArticleId, true);
            
            //Set the value of the article
            f4 = [SELECT KnowledgeArticleId FROM Featured__kav WHERE Id = :f4.Id];    
            //Publish the article
            KbManagement.PublishingService.publishArticle(f4.KnowledgeArticleId, true);
            
            //Set the value of the article
            f5 = [SELECT KnowledgeArticleId FROM Featured__kav WHERE Id = :f5.Id];    
            //Publish the article
            KbManagement.PublishingService.publishArticle(f5.KnowledgeArticleId, true);
            
            //Set the value of the article
            f6 = [SELECT KnowledgeArticleId FROM Featured__kav WHERE Id = :f6.Id];    
            //Publish the article
            KbManagement.PublishingService.publishArticle(f6.KnowledgeArticleId, true);
            
            //Set the value of the article
            m = [SELECT KnowledgeArticleId FROM DPMobile__kav WHERE Id = :m.Id];    
            //Publish the article
            KbManagement.PublishingService.publishArticle(m.KnowledgeArticleId, true);
            
            //Run the Apex class
            ArticleArchivesByType.getArticlesList('Featured__kav', 500, false, '', '', '');
            ArticleArchivesByType.getArticlesList('Featured__kav', 500, true, 'Remove articles with the topic...', 'Registration', 'magnus, peter, paul, mary');
            ArticleArchivesByType.getArticlesList('Featured__kav', 500, true, 'Show ONLY articles with the topic...', 'Tuition Posting', 'peter, magnus, paul, mary');
            ArticleArchivesByType.getArticlesList('Featured__kav', 500, true, 'Show ALL articles', '', 'magnus, peter, paul, mary');
            
            ArticleArchivesByType.findBySearch('how', 'Featured__kav');
            ArticleArchivesByType.globalSearch('how', 'Featured__kav');
            
            Test.stopTest();
        }
    }   
}