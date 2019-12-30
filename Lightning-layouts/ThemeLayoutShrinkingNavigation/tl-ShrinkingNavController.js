({
    doInit : function(component, event, helper) {
        //Upgrade browser redirect
        if (window.attachEvent && !window.addEventListener) {
            window.location = 'https://www.donorperfect.com/community/upgrade-browser';
        }
        
        //Select Product
        var _product = 	component.get("v.whichProduct");
        var cmpTarget = component.find("main-container");        
        if (_product == "DonorPerfect"){            
            $A.util.addClass(cmpTarget , 'dp-style');
        }
        
        helper.getHeaderJS(component, event);
    },
})
