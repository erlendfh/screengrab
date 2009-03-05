/**
 * @author andy
 */

screengrab = {};
sg = screengrab;
screengrab.ScriptLoader = Components.classes["@mozilla.org/moz/jssubscript-loader;1"]
                            .getService(Components.interfaces.mozIJSSubScriptLoader);
// Base64 code
screengrab.Base64 = {};
screengrab.ScriptLoader.loadSubScript("chrome://screengrab/content/external/webtoolkit.base64.js", screengrab.Base64);
screengrab.Base64 = screengrab.Base64.Base64;	

// Add access to screengrab from the document
screengrab.contentLoad = function(e) {
	var unsafeWin=e.target.defaultView;
	if (unsafeWin.wrappedJSObject) unsafeWin=unsafeWin.wrappedJSObject;

	var unsafeLoc=new XPCNativeWrapper(unsafeWin, "location").location;
	var href=new XPCNativeWrapper(unsafeLoc, "href").href;

	if(unsafeLoc.hostname == "localhost" || unsafeLoc.protocol == "file:") {
		unsafeWin.screengrab = screengrab;
	}
};

screengrab.onLoad = function() {
	var	appcontent=window.document.getElementById("appcontent");
	if (appcontent && !appcontent.screengrab_enabled) {
		appcontent.screengrab_enabled=true;
		appcontent.addEventListener("DOMContentLoaded", screengrab.contentLoad, false);
	}
};

screengrab.onUnLoad = function() {
	//remove now unnecessary listeners
	window.removeEventListener('load', screengrab.onLoad, false);
	window.removeEventListener('unload', screengrab.onUnLoad, false);
	window.document.getElementById("appcontent")
		.removeEventListener("DOMContentLoaded", screengrab.contentLoad, false);
};


window.addEventListener('load', screengrab.onLoad, false);
window.addEventListener('unload', screengrab.onUnLoad, false);