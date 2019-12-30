({
    afterRender : function( component, helper ) {

        this.superAfterRender();
	// https://salesforce.stackexchange.com/questions/153439/how-to-implement-on-scroll-action-in-lightning-to-show-next-few-list-of-records/153444
        // this is done in renderer because we don't get
        // access to the window element in the helper js.

        // per John Resig, we should not take action on every scroll event
        // as that has poor performance but rather we should take action periodically.
        // http://ejohn.org/blog/learning-from-twitter/

        var didScroll 			= false;
	//var publicHeaderShows 	= component.get( 'v.public' );
        var cmpTarget 			= component.find( 'navBar' );

        window.onscroll = function() {
            didScroll = true;
        };

        // periodically attach the scroll event listener
        // so that we aren't taking action for all events
        var scrollCheckIntervalId = setInterval( $A.getCallback( function() {
            // since this function is called asynchronously outside the component's lifecycle
            // we need to check if the component still exists before trying to do anything else 
            // ( add this to the if statement if you don't want the public header to shrink - '&& !publicHeaderShows')
            if ( didScroll && component.isValid() && (document.documentElement.clientWidth > 767  
                                                                              //|| screen.width > 767
                                                                           	|| window.innerWidth > 767
                                                                           	|| document.body.clientWidth > 767)) {				
                didScroll = false;
		
                //Get application event to store values
            	var compEvents	= $A.get("e.c:NavScrollingEvent");

                // adapted from stackoverflow to detect when user has scrolled sufficiently to end of document
                // http://stackoverflow.com/questions/4841585/alternatives-to-jquery-endless-scrolling

                // pageYOffset for IE
                if ( window['scrollY'] > 0 || pageYOffset > 0 ) {                 
        		$A.util.addClass(cmpTarget, 'scrolled-nav');
                     	compEvents.setParams({ "scrollDown" : true }); //Pass values to NavScrollingEvent
                } else {
                    	$A.util.removeClass(cmpTarget, 'scrolled-nav');
                     	compEvents.setParams({ "scrollDown" : false }); //Pass values to NavScrollingEvent
                }       
        	compEvents.fire();	// Fire event to NavMenu to condense menu if scrolled 
            }

        }), 500 );

        component.set( 'v.scrollCheckIntervalId', scrollCheckIntervalId );

    },

    unrender : function( component, helper ) {

        this.superUnrender();

        var scrollCheckIntervalId = component.get( 'v.scrollCheckIntervalId' );

        if ( !$A.util.isUndefinedOrNull( scrollCheckIntervalId ) ) {
            window.clearInterval( scrollCheckIntervalId );
        }

    }
})
