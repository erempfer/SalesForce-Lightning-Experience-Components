({
    searchKeyChange: function(component, event, helper) {
        var myEvent = $A.get("e.c:SearchKeyChange");
        myEvent.setParams({"searchKey": event.target.value});
        myEvent.fire();
    },
    
    keyDown: function(component, event, helper) {
        //Disable the 'enter' key
        if (event.keyCode === 13) {
            event.preventDefault();
        }
    },
})