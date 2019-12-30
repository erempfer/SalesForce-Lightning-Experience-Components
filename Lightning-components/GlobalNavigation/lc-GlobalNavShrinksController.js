({    
    doInit : function(component, event, helper) {
        //Select Product
        var _product = 	component.get("v.whichProduct");
        var cmpTarget = component.find("navBar-buttons");        
        if (_product == "DonorPerfect"){            
            $A.util.addClass(cmpTarget , 'dp-style');
        }
        
		helper.getHeaderJS(component, event);
    },
    
    onClick : function(component, event, helper) {
        var id = event.target.dataset.menuItemId;
        if (id) {
            component.getSuper().navigate(id);
        }
    }, 
    
    addClassJs : function(component, event, helper) {
        var cmpTarget = component.find('navBar-buttons');
        
        //Get checkbox value from ClassAppEvent sent from ClassCheckbox component
        if (event.getParam("scrollDown") === true) {    
            $A.util.addClass(cmpTarget, 'scroll-nav-btns');
        } else {
            $A.util.removeClass(cmpTarget, 'scroll-nav-btns');
        }
    },
})
