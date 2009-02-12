/**
 * @author andy
 */
screengrab.addToToolbar = function() {
    if (!screengrab.prefs.toolbarAddedOnce()) {
//	    try {
	        var firefoxnav = document.getElementById("nav-bar");
	        screengrab.debug(firefoxnav);
	        var curSet = firefoxnav.currentSet;
	        screengrab.debug(curSet);
	        if (curSet.indexOf("screengrab-toolbar-button") == -1) {
	            screengrab.debug("adding");
	            var set = firefoxnav.currentSet + ",screengrab-toolbar-button";
	            firefoxnav.setAttribute("currentset", set);
	            firefoxnav.currentSet = set;
	            document.persist("nav-bar", "currentset");
	            // If you don't do the following call, funny things happen
	            //try {
	                BrowserToolboxCustomizeDone(true);
//	            } catch (e) {
//	                screengrab.error(e);
//	            }
	        }
//	    } catch(e) {
//	        screengrab.error(e);
//	    }
		screengrab.prefs.setToolbarAddedOnce();
	}
}
window.addEventListener("load", function() {
    screengrab.addToToolbar();
}, false);