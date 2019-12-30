@isTest 
public class IdeaDashboard_test {
	@isTest static void testIdeaDashboard() {        
        //Data setup with Three users
        // - two have created an idea (to be changed to "Started" status)
        // - one has created an idea (with no / default status)
        // - two have upvoted, one for a "Started" status, with the other in the default status
        // - one has down-voted the idea to be set to Started that another has upvoted
        User user1;
        User user2;
        User user3;

        // Create the portal users
        system.runAs(new User (Id = UserInfo.getUserId())) {
            user1 = TestDataFactory.createPortalUser('User1', true, false);
            user2 = TestDataFactory.createPortalUser('User2', true, false);
            user3 = TestDataFactory.createPortalUser('User3', true, false);
        }

        // Prepare the ideas
        Idea idea1;
        Idea idea2;
        Idea idea3;

        system.runAs(user1) {
            idea1 = TestDataFactory.createIdea('Idea One',   'DonorPerfect', 'Test');
        }
        system.runAs(user2) {
            idea2 = TestDataFactory.createIdea('Idea Two',   'DonorPerfect', 'Test');
        }
        system.runAs(user3) {
            idea3 = TestDataFactory.createIdea('Idea Three', 'DonorPerfect', 'Test');
        }

        // Vote on the ideas
        system.runAs(user1) {
            TestDataFactory.createVote(idea2.Id, true);
            IdeaDashboard.saveVote( idea3.Id, 'up' );
            IdeaDashboard.saveVote( idea2.Id, 'up' );
            IdeaDashboard.hasVoted( new List<String> {idea1.Id, idea2.Id} );
        }
        system.runAs(user2) {
            TestDataFactory.createVote(idea3.Id, true);
            
        }
        system.runAs(user3) {
            TestDataFactory.createVote(idea2.Id, false);
        }        
        
		// Change the status of the ideas to be started
        list<Idea> ideas = new list<Idea>();
        idea1.Status = 'Started';
        idea2.Status = 'Started';
        ideas.add(idea1);
        ideas.add(idea2);
        
        Test.startTest();
    	IdeaDashboard.getAllIdeasByStatus('DonorPerfect');
        IdeaDashboard.getAllIdeasByStatus('EZCare');
        IdeaDashboard.getAllIdeasByStatus('');
        
        IdeaDashboard.getTopIdeasAP('EZCare', 5);  
        IdeaDashboard.getTopIdeasAP('', 5); 

        IdeaDashboard.hasVoted( new List<String> {idea1.Id, idea2.Id} );
        
        IdeaDashboard.getZones(); 
        Test.stopTest();
    }
}