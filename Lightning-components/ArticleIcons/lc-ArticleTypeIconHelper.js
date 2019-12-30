({
    getKeyWordsJS: function(component) {
        var _id 				= component.get("v.theRecordId");       
        var action 				= component.get("c.getKeyWords"); // name on the apex class
        var caseyFieldsStr1 	= 'daily to-do';
        var caseyFieldsStr2 	= 'casey fields';
        var caseyManagerStr1	= 'system manager';
        var caseyManagerStr2 	= 'casey manager';
        var ruStr1 				= 'advanced feature';
        var ruStr2 				= 'ru';
        var magnusStr1 			= 'batch task';
        var magnusStr2 			= 'magnus';
        var scoutStr1 			= 'best practice tool';
        var scoutStr2 			= 'scout';
        var piperStr1 			= 'connect and grow';
        var piperStr2 			= 'piper';
        
        //Set the parameters for the apex method using the record id
        action.setParams({
            get_recordid: _id
        });
        
        //Get the values and if there aren't any values or they're null set the haslinks attribute to false
        action.setCallback(this, function(response) {            
            if (response.getState() === "SUCCESS") {
                var _keywordStr = response.getReturnValue();			//set the string of keywords to the variable

                if(_keywordStr.length > 1 && _keywordStr != 'none') {	//if the string isn't empty or equal to the default apex string 'none'                    
                    component.set("v.showIcon", true);					//if there's an icon for the KB display it in the aura if statement
                    
                    var _icon 		= component.find("iconContainer");	//find the div with the aura id iconContainer
                    var _iconTxt 	= component.find("iconText");		//find the h5 with the aura id of iconText
                    var _tagLineStr	= 'none';							//what the description will say under the icon
                    var _whichIcon	= 'none';							//which icon to use in the src url
                    
                    if(_keywordStr.toLowerCase().indexOf(caseyFieldsStr1) > -1 || _keywordStr.toLowerCase().indexOf(caseyFieldsStr2) > -1) {
                        _tagLineStr = 'Daily To-Do';
                        _whichIcon = 'Icon_Casey.png';
                        $A.util.addClass(_iconTxt, 'casey');
                    } else if(_keywordStr.toLowerCase().indexOf(caseyManagerStr1) > -1 || _keywordStr.toLowerCase().indexOf(caseyManagerStr2) > -1) {
                        _tagLineStr = 'System Manager';
                        _whichIcon = 'Icon_Casey.png';
                        $A.util.addClass(_iconTxt, 'casey');
                    } else if(_keywordStr.toLowerCase().indexOf(ruStr1) > -1 || _keywordStr.toLowerCase().indexOf(ruStr2) > -1) {
                        _tagLineStr = 'Advanced Feature';
                        _whichIcon = 'Icon_Ru.png';
                        $A.util.addClass(_iconTxt, 'ru');
                    } else if (_keywordStr.toLowerCase().indexOf(magnusStr1) > -1 || _keywordStr.toLowerCase().indexOf(magnusStr2) > -1) {
                        _tagLineStr = 'Batch Task';
                        _whichIcon = 'Icon_Magnus.png';
                        $A.util.addClass(_iconTxt, 'magnus');
                    } else if(_keywordStr.toLowerCase().indexOf(scoutStr1) > -1 || _keywordStr.toLowerCase().indexOf(scoutStr2) > -1) {
                        _tagLineStr = 'Best Practice Tool';
                        _whichIcon = 'Icon_Scout.png';
                        $A.util.addClass(_iconTxt, 'scout');
                    } else if (_keywordStr.toLowerCase().indexOf(piperStr1) > -1 || _keywordStr.toLowerCase().indexOf(piperStr2) > -1) {
                        _tagLineStr = 'Connect and Grow';
                        _whichIcon = 'Icon_Piper.png';
                        $A.util.addClass(_iconTxt, 'piper');
                    } else {
                        component.set("v.showIcon", false);		//if the keywords don't contain any of the character names
                    }
                    
                    if(_whichIcon != 'none') { 								//If there is an icon
                        var compEvents	= $A.get("e.c:ArticleIconEvent");	//Get application event to store values
                        compEvents.setParams({ "hasIcon" : true }); 		//Pass values to ArticleIconEvent                        
                        compEvents.fire();									//Fire event to pageLayoutArticleDetail to shift KB summary over
                    }
                    
                    component.set("v.tagLine", _tagLineStr);		// set the attribute to the string
                    component.set("v.iconName", _whichIcon);
                }
            }             
        });
        
        $A.enqueueAction(action);
    },    
})