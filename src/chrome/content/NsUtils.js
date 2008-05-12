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
var SGNsUtils = {
    
    isMac : function() {
        return navigator.userAgent.toLowerCase().indexOf("mac") != -1;
    },
    
    getCurrentBrowserWindow : function() {
        var currentWindow = Components.classes["@mozilla.org/appshell/window-mediator;1"].getService(Components.interfaces.nsIWindowMediator).getMostRecentWindow("navigator:browser");
        return currentWindow.getBrowser().contentWindow;
    },
    
    getActiveFrame : function() {
        return document.commandDispatcher.focusedWindow;
    },
    
    askUserForFile : function(defaultName) {
        // get the file picker
        var result;
        var nsIFilePicker = Components.interfaces.nsIFilePicker;
        var filePicker = Components.classes["@mozilla.org/filepicker;1"].createInstance(nsIFilePicker);
        
        var saveas = document.getElementById("screengrab-strings").getString("SaveAsMessage");
        filePicker.init(window, saveas, nsIFilePicker.modeSave);
        filePicker.appendFilters(nsIFilePicker.filterImages);
        filePicker.defaultString = defaultName;
        
        result = filePicker.show();
        if (result == nsIFilePicker.returnOK || result == nsIFilePicker.returnReplace) {
            return filePicker.file;
        }
        return null;
    },
    
    dataUrlToBinaryInputStream : function(dataUrl) {
        var nsIoService = Components.classes["@mozilla.org/network/io-service;1"].getService(Components.interfaces.nsIIOService);
        var channel = nsIoService.newChannelFromURI(nsIoService.newURI(dataUrl, null, null));
        
        var binaryInputStream = Components.classes["@mozilla.org/binaryinputstream;1"].createInstance(Components.interfaces.nsIBinaryInputStream);
        binaryInputStream.setInputStream(channel.open());
        return binaryInputStream;
    },
    
    newFileOutputStream : function(nsFile) {
        var writeFlag = 0x02; // write only
        var createFlag = 0x08; // create
        var truncateFlag = 0x20; // truncate
        
        var fileOutputStream = Components.classes["@mozilla.org/network/file-output-stream;1"].createInstance(Components.interfaces.nsIFileOutputStream);
        fileOutputStream.init(nsFile, writeFlag | createFlag | truncateFlag, 0664, null);
        return fileOutputStream;
    },
    
    writeBinaryInputStreamToFileOutputStream : function(binaryInputStream, fileOutputStream) {
        var numBytes = binaryInputStream.available();
        var bytes = binaryInputStream.readBytes(numBytes);
        
        fileOutputStream.write(bytes, numBytes);
    }
}