({
    doInit : function(component, event, helper) {
        helper.getKeyWordsJS(component);
    },
    
    gotoURL: function(cmp, event) {
        //Get the icon name to determine what character link is needed
        var whichCharacter	= cmp.get("v.iconName");
        var characterNum	= '1'; //For Casey. It's the default value.
        if (whichCharacter == 'Icon_Ru.png') 			{ characterNum = '2'} //For Ru
        else if (whichCharacter == 'Icon_Magnus.png') 	{ characterNum = '3'} //For Magnus
        else if (whichCharacter == 'Icon_Scout.png') 	{ characterNum = '4'} //For Scout
        else if (whichCharacter == 'Icon_Piper.png') 	{ characterNum = '5'} //For Piper
        
        var myURL			= cmp.get("v.clickLink" + characterNum); 
        var urlEvent 		= $A.get("e.force:navigateToURL");
        urlEvent.setParams({
            "url": myURL
        });
        urlEvent.fire();                          
    },    
})
