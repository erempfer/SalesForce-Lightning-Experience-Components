({
    doInitJs : function(component, event, helper) {
        if (window.attachEvent && !window.addEventListener) {
            window.location = 'https://www.donorperfect.com/community/upgrade-browser';
        }
    }
})