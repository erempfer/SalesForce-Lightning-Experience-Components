({
    getOverviewJS : function(cmp, event) {
        var action = cmp.get("c.getDTMappingInfo");
        action.setParams({
            recordID: cmp.get("v.theRecordId")
        });
        
        action.setCallback(this, function(response){
            var thisState	= response.getState();			
            var thisValue 	= response.getReturnValue();
            
            if (thisState === "SUCCESS") {
                var _values = thisValue[0];					//get the first set of values in the array
                cmp.set("v.overviewInfo", thisValue);                
                
                //Display a blank page if a mapping date is not entered
                if(_values.Initial_Mapping__c == undefined) {
                    cmp.set("v.dataMapped", false);		
                }
                
                //Hide the bullet point if there are no special notes
                var mp		= _values.Mapping_Notes__c;
                var notes	= cmp.find('specialNotes');
                if(mp == undefined || mp.length === 0){
                    $A.util.addClass(notes, 'hidden');
                }
                
                //Set the records to keep number
                var mf		= _values.Actual_Records__c;
                var r2d		= _values.Marked_for_Deletion__c;
                var r2k		= mf - r2d;
                if (isNaN(r2k)) { r2k = 0 };
                cmp.set("v.records2Keep", r2k);
                
                //Display warning for records to keep
                var r2kBox	= cmp.find('recordsToKeep');
                var teWarn	= cmp.find('teWarning');
                if (r2k > _values.Max_Data_Transfer_Records__c) {
                    $A.util.removeClass(teWarn, 'hidden');
                    $A.util.addClass(r2kBox, 'exceeds-limit');
                }
                
                //Set the icon status for the data enhancement list
                var de 		= _values.Data_Enhancements__c;
                if (de === undefined || de === null) {de = ''};		//if there are no selections from the picklist set a default
                var ncoa 	= cmp.find('NCOA');
                var deID 	= cmp.find('deceasedID');
                var phone 	= cmp.find('phoneAppend');
                if(de.indexOf('NCOA') > -1) {
                    $A.util.removeClass(ncoa, 'fa-times-circle');	//remove the red circle icon
                    $A.util.addClass(ncoa, 'fa-check-circle');		//add the green checkmark icon
                }
                if(de.indexOf('Deceased') > -1) {
                    $A.util.removeClass(deID, 'fa-times-circle');	//remove the red circle icon
                    $A.util.addClass(deID, 'fa-check-circle');		//add the green checkmark icon
                }  
                if(de.indexOf('Phone') > -1) {
                    $A.util.removeClass(phone, 'fa-times-circle');	//remove the red circle icon
                    $A.util.addClass(phone, 'fa-check-circle');		//add the green checkmark icon
                }
            }          
        });
        $A.enqueueAction(action);
    },
    
    getMappingJS : function(cmp, event) {
        var action = cmp.get("c.getAttachedMapping");
        action.setParams({
            recordID: cmp.get("v.theRecordId")
        });
        
        action.setCallback(this, function(response){            
            var thisState	= response.getState(); 
            var thisValue 	= response.getReturnValue();            
            if (thisState === "SUCCESS" && thisValue[0] != 'no attachment' ) {
                var totalMapped 	= thisValue.pop();				//remove and get the last value in the array
                var mappedInfo 		= thisValue;					//get all the values except the last value in the array
                cmp.set("v.totalMappedFields", totalMapped);
                cmp.set("v.mappingInfo", mappedInfo);
            } else {
                cmp.set("v.hasAttachment", false);
            }       
        });
        $A.enqueueAction(action);
    },
})