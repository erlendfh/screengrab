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
