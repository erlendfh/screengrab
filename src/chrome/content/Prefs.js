/*
Copyright (C) 2004-2007  Andy Mutton

This program is free software; you can redistribute it and/or
modify it under the terms of the GNU General Public License
as published by the Free Software Foundation; either version 2
of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program; if not, write to the Free Software
Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.

Contact: andy@5263.org
*/
screengrab.prefs = {
	
	PNG : "png",
	JPEG : "jpeg",
	
	extensionPrefix : "extensions.screengrab.",
	
    includeTimeStampInFilename : "includeTimeStampInFilename",
    imageFormat : "imageFormat",
	imageQuality : "jpgImageQuality",
	enableLogging : "enableLogOutput",
	numberofGrabsTaken : "numberOfGrabs",
	showIconInStatusBar: "showIconInStatusBar",
	showInContextMenu : "showInContextMenu",
	loggerPref : "loggerFilename",
	showFileInDownloadsPref : "showFileInDownloads",
	useBrowserDownloadDirPref : "useBrowserDownloadDir",
	toolbarAddedOncePref : "toolbarAddedOnce",
	
	prefBranch : null,
	
	getBool: function(pref) {
		return nsPreferences.getBoolPref(this.extensionPrefix + pref);
	},
	
	getInt: function(pref) {
        return nsPreferences.getBoolPref(this.extensionPrefix + pref);
    },
	
	format : function() {
        if (nsPreferences.getIntPref(this.extensionPrefix + this.imageFormat) == 0) {
            return this.PNG;
        } else {
            return this.JPEG;
        }
    },
	
	formatMimeType : function() {
        if (nsPreferences.getIntPref(this.extensionPrefix + this.imageFormat) == 0) {
            return "image/png";
        } else {
            return "image/jpeg";
        }
    },
	
	formatQuality : function(mimeType) {
		if (mimeType == "image/png") {
			return "";
		}
		return 'quality=' + nsPreferences.getIntPref(this.extensionPrefix + this.imageQuality);
    },
	
	showFileInDownloads : function() {
		return nsPreferences.getBoolPref(this.extensionPrefix + this.showFileInDownloadsPref);
	},
    
    defaultFileName : function() {
        var filename = window.content.document.title;
        if (nsPreferences.getBoolPref(this.extensionPrefix + this.includeTimeStampInFilename)) {
            dt = new Date();
            filename = filename + "_" + dt.getTime();
        }
        return filename;
    },
	
	loggerFileName : function() {
		if (window.navigator.userAgent.toLowerCase().indexOf("win") > -1) {
			var defaultFileName = "C:\screengrab.log";
		} else {
			var defaultFileName = "/tmp/screengrab.log";
		}
		return nsPreferences.copyUnicharPref(this.extensionPrefix + this.loggerPref, defaultFileName);
	},
	
	loggingEnabled : function() {
		return nsPreferences.getBoolPref(this.extensionPrefix + this.enableLogging, false);
	},
	
	/*
	 * The time to wait for Java applets to get ready after scrolling 
	 * them into position to capture them.
	 */
	javaScrollWaitTime : function() {
		var defaultTime = 50;
		if (window.navigator.userAgent.toLowerCase().indexOf("mac") > -1) {
			defaultTime = 400;
		}
		return nsPreferences.getIntPref(this.extensionPrefix + "javaScrollWaitMs", defaultTime);
	},
	
	javaEnabled : function() {
		if (!window.navigator.javaEnabled()) {
			return false;
		}
		return nsPreferences.getBoolPref(this.extensionPrefix + "useJavaIfAvailable");
	},
	
	incGrabCount : function() {
		var numTaken = nsPreferences.getIntPref(this.extensionPrefix + this.numberofGrabsTaken, 0);
		nsPreferences.setIntPref(this.extensionPrefix + this.numberofGrabsTaken, numTaken + 1);
	},
	
	browserDownloadDir : function() {
		return nsPreferences.copyUnicharPref("browser.download.dir");
	},
	
	useBrowserDownloadDir : function () {
		return nsPreferences.getBoolPref(this.extensionPrefix + this.useBrowserDownloadDirPref);
	},
	
	toolbarAddedOnce: function() {
		return this.getBool(this.toolbarAddedOncePref);
	},
	
	setToolbarAddedOnce: function() {
        return nsPreferences.setBoolPref(this.extensionPrefix + this.toolbarAddedOncePref, true);
    },
	
	refreshContextMenu : function() {
		if (nsPreferences.getBoolPref(this.extensionPrefix + this.showInContextMenu, true)) {
			this.show("screengrab-context-menu");
			this.show("screengrab-context-separator");
		} else {
			this.hide("screengrab-context-menu");
			this.hide("screengrab-context-separator");
		}
	},
	
	refreshMenuChoices : function() {
		if (!this.javaEnabled()) {
			this.hide("pop-grabWindow");
		} else {
			this.show("pop-grabWindow");
		}
	},

	refreshShortcuts : function() {
//		setShortcut("screengrab-key-copy-complete", "c", "control shift");
//        setShortcut("screengrab-key-copy-visible", "v", "control shift");
//        setShortcut("screengrab-key-save-complete", "d", "control shift");
//        setShortcut("screengrab-key-save-visible", "f", "control shift");
    },
	
	setShortcut : function(id, key, modifiers) {
		var keyElem = document.getElementById(id);
		keyElem.key = key;
		keyElem.modifiers = modifiers;
	},
	
	refreshStatusbar : function() {
		if (nsPreferences.getBoolPref(this.extensionPrefix + this.showIconInStatusBar), true) {
			this.show("screengrab_panel");
		} else {
			this.hide("screengrab_panel");
		}
	},
	
	observe : function(aSubject, aTopic, aData) {
		if (aTopic != "nsPref:changed") return;
		
		sg.debug("Observed change in " + aData);
	    switch (aData) {
	    	case this.showIconInStatusBar: 
				this.refreshStatusbar();
	        	break;
	    	case this.showInContextMenu:
				this.refreshContextMenu();
	        	break;
	    }
		refreshShortcuts();
	},
	
	register: function() {
	    var prefService = Components.classes["@mozilla.org/preferences-service;1"]
	                                .getService(Components.interfaces.nsIPrefService);
	    this.prefBranch = prefService.getBranch(this.extensionPrefix);
	    this.prefBranch.QueryInterface(Components.interfaces.nsIPrefBranch2);
	    this.prefBranch.addObserver("", this, false);
	},
	
	unregister: function() {
	    if (!this.prefBranch) return;
	    this.prefBranch.removeObserver("", this);
    },
	
	hide : function(elementId) {
		try {
			document.getElementById(elementId).style.display = "none";
		} catch (error) {
			sg.error(error + ":" + elementId);
		}
	},
	
	show : function(elementId) {
		try {
			document.getElementById(elementId).style.display = "";
		} catch (error) {
			sg.error(error + ":" + elementId);
		}
	},
	
	configuratePrefs : function() {
		screengrab.prefs.register();
		setTimeout(function() {
			screengrab.prefs.refreshContextMenu();
			screengrab.prefs.refreshStatusbar();
			screengrab.prefs.refreshMenuChoices();
            screengrab.prefs.refreshShortcuts();
		}, 100);
	},
	
	instantApply: function() {
		return nsPreferences.getBoolPref("browser.preferences.instantApply");
	},
	
	openPrefs:function() {
		window.openDialog("chrome://screengrab/content/preferences.xul", "screengrab-options-dialog", "toolbar,centerscreen,chrome,modal,resizable" + this.instantApply() ? ",dialog=no" : "");
	}
}
window.addEventListener("load", function() {
    screengrab.prefs.configuratePrefs();
}, false);