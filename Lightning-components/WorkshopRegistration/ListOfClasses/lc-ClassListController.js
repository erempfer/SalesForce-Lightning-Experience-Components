({
    doInitJs: function(component, event, helper) {         
        var _product 	= component.get("v.whichProduct");
        var cmpTarget 	= component.find("main");
		var isIE 		= false;
        var outmessage 	= component.find("outdatedBrowser");
        var noClassMess	= component.find("noClass");
        var ua 			= window.navigator.userAgent;        
        var msie 		= ua.indexOf('MSIE ');			// IE 10 or older => return version number 
        var trident 	= ua.indexOf('Trident/');		// IE 11 => return version number
        
        //Select product styling
        if (_product == "DonorPerfect"){            
            $A.util.addClass(cmpTarget , 'dp-style');
        }

		// Detect for Internet Explorer 6-11        
        if (msie > 0 || trident > 0) {
            isIE = true;
            component.set("v.noClasses", true);
            component.set("v.isIE", isIE);
        } else {
            helper.loadClassesJs(component);			//If it's not IE load the apex class
        }
    },
    
    gotoURLChrome: function(cmp, event){    
        var myURL			= "https://www.google.com/chrome/"; 
        var urlEvent 		= $A.get("e.force:navigateToURL");
        urlEvent.setParams({
            "url": myURL
        });
        urlEvent.fire();                          
    },  
    
    gotoURLFireFox: function(cmp, event){    
        var myURL			= "https://www.mozilla.org/en-US/firefox/new/"; 
        var urlEvent 		= $A.get("e.force:navigateToURL");
        urlEvent.setParams({
            "url": myURL
        });
        urlEvent.fire();                          
    },  
    
    detectIE: function (cmp, event) {      
        //Detect IE returns version of IE or false, if browser is not Internet Explorer
        var ua = window.navigator.userAgent;
        
        // Test values; Uncomment to check result…        
        // IE 10
        // ua = 'Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.2; Trident/6.0)';        
        // IE 11
        // ua = 'Mozilla/5.0 (Windows NT 6.3; Trident/7.0; rv:11.0) like Gecko';
        
        var msie = ua.indexOf('MSIE ');
        if (msie > 0) {
            // IE 10 or older => return version number
            return parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
        }
        
        var trident = ua.indexOf('Trident/');
        if (trident > 0) {
            // IE 11 => return version number
            var rv = ua.indexOf('rv:');
            return parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);
        }
        
        // other browser
        return false;
    },  
})