public with sharing class GetCaseArticles {
	@AuraEnabled
    public static List<sObject> getArticlesList(String whichCase){
        List<sObject> theList;        
      
        theList = 	[SELECT Id, KnowledgeArticleId, CaseArticle.KnowledgeArticleVersion.Title, CaseArticle.KnowledgeArticleVersion.Id, CaseArticle.KnowledgeArticleVersion.UrlName, CaseArticle.KnowledgeArticleVersion.Summary, CaseArticle.KnowledgeArticleVersion.LastPublishedDate 
					FROM CaseArticle 
					WHERE CaseId=:whichCase
					ORDER BY CaseArticle.KnowledgeArticleVersion.Title ASC]; 
        
        return theList;
    }       
}