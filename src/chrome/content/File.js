
screengrab.File = function(file, mimeType) {
	this.nsFile = file;
	this.mimeType = mimeType;
}
screengrab.File.FileInputStream = Components.Constructor("@mozilla.org/network/file-input-stream;1", "nsIFileInputStream", "init");
screengrab.File.BinaryInputStream = Components.Constructor("@mozilla.org/binaryinputstream;1", "nsIBinaryInputStream", "setInputStream");
screengrab.File.MultiplexInputStream = Components.Constructor("@mozilla.org/io/multiplex-input-stream;1", "nsIMultiplexInputStream");
screengrab.File.BufferedInputStream = Components.Constructor("@mozilla.org/network/buffered-input-stream;1", "nsIBufferedInputStream", "init");
screengrab.File.StringInputStream = Components.Constructor("@mozilla.org/io/string-input-stream;1", "nsIStringInputStream", "setData");
screengrab.File.IOService = Components.Constructor("@mozilla.org/network/io-service;1", "nsIIOService");
screengrab.File.prototype = {
	remove : function() {
		this.nsFile.remove(false);
	},
	
	getBufferedStream: function() {
        var stream = new sg.File.FileInputStream(this.nsFile, 0x01, 00004, null);
        return new sg.File.BufferedInputStream(stream, 90000);
	},
	
	readBytes: function() {
		// open the local file
	    var stream = new sg.File.FileInputStream(this.nsFile, 0x01, 00004, null);
        var buffered = new sg.File.BufferedInputStream(stream, 90000);
	    var binary = new sg.File.BinaryInputStream(buffered);
		var data = "";
		while (binary.available() > 0) {
			data += binary.readBytes(binary.available());
		}
		return data;
	},
	
	toFileUrl : function() {
		return new sg.File.IOService().newFileURI(this.nsFile);
		
	},
	saveDataUrlWithCallbackWhenDone : function(dataUrl, callback) {
		var nsUri = new sg.File.IOService().newURI(dataUrl, "UTF8", null);
        
        var persist = this.createPersist();
		persist.progressListener = {
			onStateChange : function(aWebProgress, aRequest, aStateFlags, aStatus) {
				if ((aStateFlags & Components.interfaces.nsIWebProgressListener.STATE_STOP) == Components.interfaces.nsIWebProgressListener.STATE_STOP) {
					screengrab.debug("Saved.");
					if (callback) callback();
                }
			}
		};
        persist.saveURI(nsUri, null, null, null, null, this.nsFile);
	},
	
	saveDataUrl: function(dataUrl, quietly){
        sg.debug("Saving...");
        var nsUri = new sg.File.IOService().newURI(dataUrl, "UTF8", null);
		
		var persist = this.createPersist();
		if (!quietly) {
			persist.progressListener = this.createTransferProgressListener(nsUri, persist);
		}
		persist.saveURI(nsUri, null, null, null, null, this.nsFile);
    },
	
	createPersist: function() {
		var persist = Components.classes["@mozilla.org/embedding/browser/nsWebBrowserPersist;1"].createInstance(Components.interfaces.nsIWebBrowserPersist);
        persist.persistFlags = Components.interfaces.nsIWebBrowserPersist.PERSIST_FLAGS_REPLACE_EXISTING_FILES;
        persist.persistFlags |= Components.interfaces.nsIWebBrowserPersist.PERSIST_FLAGS_AUTODETECT_APPLY_CONVERSION;
        return persist;
	},
	
	createTransferProgressListener: function(nsUri, persist) {
        var target = this.toFileUrl();
        var tr = Components.classes["@mozilla.org/transfer;1"].createInstance(Components.interfaces.nsITransfer);
        tr.init(nsUri, target, "", null, null, null, persist);
        return tr;
	}
}
screengrab.File.newTempFile = function(name, mimeType) {
	var file = Components.classes["@mozilla.org/file/directory_service;1"].getService(Components.interfaces.nsIProperties).get("TmpD", Components.interfaces.nsIFile);
    file.append(name);
    file.createUnique(Components.interfaces.nsIFile.NORMAL_FILE_TYPE, 0666);
	return new screengrab.File(file, mimeType);
}
screengrab.File.named = function(name, mimeType) {
	var nsFile = Components.classes["@mozilla.org/file/local;1"].createInstance(Components.interfaces.nsILocalFile);
    nsFile.initWithPath(name);
	return new screengrab.File(nsFile, mimeType);
}
screengrab.File.sanitiseName = function(name) {
    var replaceChar = "_";
    var fileNameRegEx = new RegExp('[,/\:*?""<>|]', 'g');
	return name.replace(fileNameRegEx, replaceChar);
}

screengrab.ImageFilePicker = function(defaultFileName, message, selected) {
    this.defaultFileName = defaultFileName;
    this.message = message;
    this.selected = selected;
    this.file = null;
    this.type = null;
}
screengrab.ImageFilePicker.prototype = {
	show : function() {
        var fp = Components.classes["@mozilla.org/filepicker;1"].createInstance(Components.interfaces.nsIFilePicker);
        
        fp.init(window, this.message, Components.interfaces.nsIFilePicker.modeSave);
        fp.defaultString = this.defaultFileName;
        fp.appendFilter("PNG", "*.png;*.gnp");
        fp.appendFilter("JPG", "*.jpg;*jpeg");
        if (this.selected == "image/png") {
            fp.filterIndex = 0;
        } else {
            fp.filterIndex = 1;
        }
        
        var result = fp.show();
        if (result == fp.returnOK || result == fp.returnReplace) {
            this.file =  fp.file;
            this.type = "image/png";
            this.mimeOptions = "";
            if (fp.filterIndex == 1) {
                this.type = "image/jpeg";
            }
        }
    },
    
    getFile : function() {
		if (this.file == null) {
			this.show();
		}
        return new screengrab.File(this.file, this.type);
    }
}