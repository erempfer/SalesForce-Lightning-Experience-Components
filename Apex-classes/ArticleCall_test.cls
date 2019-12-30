@isTest
private class ArticleCall_test{
    static testMethod void ArticleCallTester () {
        ArticleCall.getKAVList();
        ArticleCall.getMostRecent(10, true);
        ArticleCall.getMostRecent(10, null);
       	ArticleCall.findBySearch('how');
        ArticleCall.globalArticleSearch('how', null, null);
        ArticleCall.globalArticleSearch('how', 8, true);
    }   
}