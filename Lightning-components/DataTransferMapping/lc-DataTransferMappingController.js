({
    doInitJs: function(cmp, event, helper) {
        helper.getOverviewJS(cmp, event);
        helper.getMappingJS(cmp, event);
        
        //Select Product
        var _product = 	cmp.get("v.whatProduct");
        var cmpTarget = cmp.find("dt-map"); 				//There's more than one aura:id of "dt-map" which creates an array instead       
        if (_product == "DonorPerfect"){  
            for(var thisOne in cmpTarget){					//Add the class name to every element in the array with the aura:id
                $A.util.addClass(cmpTarget[thisOne] , 'dp-style');
            }
			cmp.set("v.isDP", true);            
        }
    },   
})