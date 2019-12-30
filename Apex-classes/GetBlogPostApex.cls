public with sharing class GetBlogPostApex {
    @AuraEnabled
    public static List<Blog_Post__c> getBlog(String product) {
        String thisProduct = product;
        
        if (String.isEmpty(thisProduct)) {
        	thisProduct = 'DonorPerfect';
        }
        
        List<Blog_Post__c> blogPost = [	SELECT Id, Name, Body__c, Product__c, Blog_Link__c, Background_Color__c, CreatedDate, LastModifiedDate
                                       FROM Blog_Post__c 
                                       WHERE Product__c=:thisProduct 
                                       ORDER BY CreatedDate desc limit 1]; 
        return blogPost;
    }
}