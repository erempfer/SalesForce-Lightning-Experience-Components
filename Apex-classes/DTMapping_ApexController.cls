public with sharing class DTMapping_ApexController {      
    @AuraEnabled
    public static List<Data_Services__c> getDTMappingInfo(String recordID){
        List<Data_Services__c> dsList;
        
        dsList = [SELECT Id, 
                  Account__r.Name,
                  Account_Manager_Front_Line_Sales__c,
                  AM_FL_Sales_Email__c,
                  AM_FL_Sales_Phone__c,
                  Actual_Records__c,      
                  Client_ID__c, 
                  Completion_Date__c,
                  Data_Enhancements__c,
                  Final_Data_Due_Date__c,
                  Final_Data_Expected__c, 
                  IC_Email__c,
                  IC_Name__c,
                  IC_Phone__c,
                  Initial_Mapping__c,
                  Mapped_Fields__c,
                  Mapping_Notes__c,
                  Marked_for_Deletion__c,
                  Max_Data_Transfer_Records__c,
                  Opportunity__c,
                  Owner.Name,
                  Owner.Email,
                  Owner.Phone,
                  Primary_Contact__r.Name,
                  Secondary_Contact__r.Name,
                  Source_Data_Type__c, 
                  Source_Data_Type_Other__c
                  FROM Data_Services__c
                  WHERE Id =: recordID]; //'a0E5A00000n5zbL'
        
        //Loop through the fields in the query to check their values
        for (Data_Services__c serviceLoop : dsList) {
            if(serviceLoop.Marked_for_Deletion__c == NULL) {
                serviceLoop.Marked_for_Deletion__c = 0;		//If there's no value for the deletion give it a value of 0
            }
            if(serviceLoop.Max_Data_Transfer_Records__c == NULL) {
                serviceLoop.Max_Data_Transfer_Records__c = 0;	//If there's no value for the max records give it a value of 0
            }
        }
        
        return dsList;
    }
    
    @AuraEnabled
    public static List<Object> getAttachedMapping(String recordID) {
        Id parentID                 	= recordID;
        List<List<String>> attachList	= new List<List<String>>();			//an array for each row that contains an array of each column
        List<Object> attachAllInfo 		= new List<Object>();				//an array that contains the row values and the totalRow count
        Attachment attachments			= new Attachment();
        Integer totalRows				= 0;    
        String subHeader				= '(Data Source)';
        
        try {
            attachments	= [SELECT body FROM Attachment WHERE parentId = :parentId AND Name LIKE '%Mapping%' AND Name LIKE '%.txt%' Order BY Createddate Desc Limit 1];        
        } catch (Exception e) {
            System.debug('Error:' + e);            
            attachments.Body = Blob.valueOf('no attachment');            
        }                
        
        String attachAsString       	= attachments.body.toString();    	//convert the blog to a string
        String[] attachFileLines    	= attachAsString.split('\n');		//split the line breaks 
        
        for(Integer i=0; i < attachFileLines.size(); i++){
            String[] attachCells = attachFileLines[i].split('\t'); //split the tab breaks
            if (attachCells.size() > 1) {
                if(String.isBlank(attachCells[0]) && attachCells[1].containsIgnoreCase(subHeader) == false){ 	//if the first column is empty and isn't a subheader
                    totalRows = totalRows + 1;
                    
                    //Add html styling to the data columns
                    //If all three columns are blank
                    if (String.isBlank(attachCells[1]) && String.isBlank(attachCells[2]) && String.isBlank(attachCells[3])) {
                        attachCells[1] = '<div class="table-column data no-border">' + attachCells[1] + '</div>';
                        attachCells[2] = '<div class="table-column data no-border">' + attachCells[2] + '</div>';
                        attachCells[3] = '<div class="table-column data no-border">' + attachCells[3] + '</div>';
                        //If there's a fourth column
                        if (attachCells.size() > 4) {
                            attachCells[4] = '<div class="table-column data no-border">' + attachCells[4] + '</div>';
                        }                        
                    } else {
                        attachCells[1] = '<div class="table-column data">' + attachCells[1] + '<i class="fas fa-arrow-circle-right"></i></div>';
                        attachCells[2] = '<div class="table-column data">' + attachCells[2] + '</div>';
                        attachCells[3] = '<div class="table-column data">' + attachCells[3] + '</div>';
                        //If there's a fifth column
                        if (attachCells.size() > 4) {
                            attachCells[4] = '<div class="table-column data">' + attachCells[4] + '</div>';
                        }  
                    }                               
                }
                //When there's subcontent in the second column add html for styling
                else if(attachCells[1].containsIgnoreCase(subHeader)) {
                    attachCells[1] = '<div class="table-column subHeader">' + attachCells[1] + '</div>';
                    attachCells[2] = '<div class="table-column subHeader">' + attachCells[2] + '</div>';
                    attachCells[3] = '<div class="table-column subHeader">' + attachCells[3] + '</div>';
                    //If there's a fifth column
                    if (attachCells.size() > 4) {
                        attachCells[4] = '<div class="table-column subHeader">' + attachCells[4] + '</div>';
                    }
                }
                //When there's content in the first column add html for styling
                else if(String.isNotBlank(attachCells[0])) {
                    attachCells[0] = '<div class="table-column header"><i class="fas fa-folder"></i>' + attachCells[0] + '</div>';
                }
            }
            attachList.add(attachCells);  
        }  
        
        attachAllInfo.addAll(attachList);
        attachAllInfo.add(totalRows); 
        //System.debug(attachAllInfo); 
        return attachAllInfo;      
    } 
}