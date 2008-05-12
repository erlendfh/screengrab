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
var SGDimensions = {
    
    Box : function(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;  
    },
    
    FrameDimensions : function() {
        this.frame = SGNsUtils.getActiveFrame();
        this.doc = this.frame.document;
        this.viewport = new SGDimensions.BrowserViewportDimensions()
    },
    
    BrowserWindowDimensions : function() {
    },
    
    BrowserViewportDimensions : function() {
    }
}

SGDimensions.Box.prototype = {
    
    getX : function() {
        return this.x;
    },
    
    getY : function() {
        return this.y;
    },
    
    getWidth : function() {
        return this.width;
    },
    
    getHeight : function() {
        return this.height;
    }
}

SGDimensions.BrowserViewportDimensions.prototype = {
    
    getWindow : function() {
        return SGNsUtils.getCurrentBrowserWindow();
    },
    
    getBrowser : function() {
        return document.getElementById("content").selectedBrowser;
    },
    
    getScreenX : function() {
        return this.getBrowser().boxObject.screenX;
    },
    
    getScreenY : function() {
        return this.getBrowser().boxObject.screenY;
    },
    
    getScrollX : function() {
        return window.content.scrollX;
    },
    
    getScrollY : function() {
        return window.content.scrollY;
    },
    
    getHeight : function() {
        var height = 0;
        if (window.content.document.compatMode == "CSS1Compat") {
            // standards mode
            height = window.content.document.documentElement.clientHeight;
        } else { //if (compatMode == "BackCompat") 
            // quirks mode
            height = window.content.document.body.clientHeight;
        }
        return height;
    },
    
    getWidth : function() {
        if (window.content.document.compatMode == "CSS1Compat") {
            // standards mode
            return window.content.document.documentElement.clientWidth;
        } else { //if (compatMode == "BackCompat")
            // quirks mode
            return window.content.document.body.clientWidth;
        }
    }
}

SGDimensions.BrowserWindowDimensions.prototype = {
    
    getWindow : function() {
        return window;
    },
    
    getScreenX : function() {
        return window.screenX + window.screen.availLeft;
    },
    
    getScreenY : function() {
        return window.screenY + window.screen.availTop;
    },
    
    getWidth : function() {
        return window.outerWidth + window.screen.availLeft;
    },
    
    getHeight : function() {
        return window.outerHeight + window.screen.availTop;
    },
    
    getHeightIgnoringExternalities : function() {
        return window.outerHeight;
    }
}

SGDimensions.FrameDimensions.prototype = {
    
    getWindow : function() {
        return this.frame;
    },
    
    getFrameHeight : function() {
        if (this.doc.compatMode == "CSS1Compat") {
            // standards mode
            return this.doc.documentElement.clientHeight;
        } else {
            // quirks mode
            return this.doc.body.clientHeight;
        }
    },
    
    getFrameWidth : function() {
        if (this.doc.compatMode == "CSS1Compat") {
            // standards mode
            return this.doc.documentElement.clientWidth;
        } else {
            // quirks mode
            return this.doc.body.clientWidth;
        }
    },
    
    getDocumentHeight : function() {
        return this.doc.documentElement.scrollHeight;
    },
    
    getDocumentWidth : function() {
        if (this.doc.compatMode == "CSS1Compat") {
            // standards mode
            return this.doc.documentElement.scrollWidth;
        } else {
            // quirks mode
            return this.doc.body.scrollWidth;
        }
    },
    
    getScreenX : function() {
        var offsetFromOrigin = 0;
        if (this.frame.frameElement) {
            offsetFromOrigin = this.frame.frameElement.offsetLeft;
        }
        return this.viewport.getScreenX() + offsetFromOrigin;
    },
    
    getScreenY : function() {
        var offsetFromOrigin = 0;
        if (this.frame.frameElement) {
            offsetFromOrigin = this.frame.frameElement.offsetTop;
        }
        return this.viewport.getScreenY() + offsetFromOrigin;
    }
}