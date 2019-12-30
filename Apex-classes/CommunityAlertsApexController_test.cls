@isTest(SeeAllData=true)
public class CommunityAlertsApexController_test {
    static testMethod void CommunityAlertsTester () {   
            //Run the Apex class
            CommunityAlertsApexController.getAlertCount('DonorPerfect', 'Knowledgebase', 15);
            CommunityAlertsApexController.getAlertCount('EZCare', 'Training', 150);
            CommunityAlertsApexController.getAlertCount('DonorPerfect', 'Groups', 150);
            CommunityAlertsApexController.getAlertCount('EZCare', 'Invoice', 150);
            CommunityAlertsApexController.getAlertCount('DonorPerfect', 'Cases', 150);
            CommunityAlertsApexController.getAlertCount('', '', null);
        }
    }