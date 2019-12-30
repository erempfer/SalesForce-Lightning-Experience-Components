({
    doInitJs: function(component, event, helper) {
        //Select Product
        var _product = 	component.get("v.valueProduct");
        var cmpTarget = component.find("training-form");        
        if (_product == "DonorPerfect"){            
            $A.util.addClass(cmpTarget , 'dp-style');
        }
        
        //Pull the current user information
        helper.onLoadJs(component, event);
    },
    
    checkboxJs : function (component, event, helper) { 
		helper.enableSubmitJs(component, event);
    }, 
})