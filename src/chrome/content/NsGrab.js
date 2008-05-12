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
SGNsGrab = {
    
    NsGrab : function(grabToClipboard) {
        if (null == grabToClipboard) {
            this.grabToClipboard = false;
        } else {
            this.grabToClipboard = grabToClipboard;
        }
    }
}

SGNsGrab.NsGrab.prototype = {
    
    /** entire page */
    grabPage : function() {
        var frameDim = new SGDimensions.FrameDimensions();
        var width = frameDim.getDocumentWidth();
        var height = frameDim.getDocumentHeight();
        if (frameDim.getFrameWidth() > width) width = frameDim.getFrameWidth();
        if (frameDim.getFrameHeight() > height) height = frameDim.getFrameHeight();
        
        var box = new SGDimensions.Box(0, 0, width, height);
        this.grab(frameDim.getWindow(), box);
    },
    
    /** selection in box */
    grabSelection : function(grabBox) {
        var viewDim = new SGDimensions.BrowserViewportDimensions();
        var box = new SGDimensions.Box(viewDim.getScrollX() + grabBox.getX(), viewDim.getScrollY() + grabBox.getY(), grabBox.getWidth(), grabBox.getHeight());
        this.grab(SGNsUtils.getCurrentBrowserWindow(), box);
    },
    
    /** visible portion in window */
    grabVisiblePage : function() {
        var viewDim = new SGDimensions.BrowserViewportDimensions();
        var box = new SGDimensions.Box(viewDim.getScrollX(), viewDim.getScrollY(), viewDim.getWidth(), viewDim.getHeight());
        this.grab(SGNsUtils.getCurrentBrowserWindow(), box);
    },
    
    /** entire browser window. */
    grabBrowser : function() {
        var browserDim = new SGDimensions.BrowserWindowDimensions();
        var box = new SGDimensions.Box(0, 0, browserDim.getWidth(), browserDim.getHeightIgnoringExternalities());
        this.grab(browserDim.getWindow(), box);
    },
    
    grab : function(windowToGrab, box) {
        var format = Screengrab.format();
        var canvas = this.prepareCanvas(box.getWidth(), box.getHeight());
        var context = this.prepareContext(canvas, box);
        context.drawWindow(windowToGrab, box.getX(), box.getY(), box.getWidth(), box.getHeight(), "rgb(0,0,0)");
        context.restore();
        var dataUrl = canvas.toDataURL("image/" + format);
        
        if (this.grabToClipboard) {
            this.saveToClipboard(dataUrl);
        } else {
            this.saveToFile(dataUrl, format);
        }
    },

    saveToFile : function(dataUrl, format) {
        var nsFile = SGNsUtils.askUserForFile(Screengrab.defaultFileName() + "." + format);
        if (nsFile != null) {
            var binaryInputStream = SGNsUtils.dataUrlToBinaryInputStream(dataUrl);
            var fileOutputStream = SGNsUtils.newFileOutputStream(nsFile);
            SGNsUtils.writeBinaryInputStreamToFileOutputStream(binaryInputStream, fileOutputStream);
            fileOutputStream.close();
        }
    },

    saveToClipboard : function(dataUrl) {
        var image = window.content.document.createElement("img");
        image.setAttribute("style", "display: none");
        image.setAttribute("id", "screengrab_buffer");
        image.setAttribute("src", dataUrl);
        var body = window.content.document.getElementsByTagName("html")[0];
        body.appendChild(image);
        setTimeout(this.makeClipboardFinishClosure(image, body, document), 200);
    },
    
    makeClipboardFinishClosure : function(image, body, documenty) {
        return (function () {
            documenty.popupNode = image;
            try {
                goDoCommand('cmd_copyImage');
            } catch (ex) {
                alert(ex);
            }
            body.removeChild(image);    
        });
    },
    
    prepareContext : function(canvas, box) {
        var context = canvas.getContext("2d");
        context.clearRect(box.getX(), box.getY(), box.getWidth(), box.getHeight());
        context.save();
        return context;
    },
    
    prepareCanvas : function(width, height) {
        var styleWidth = width + "px";
        var styleHeight = height + "px";
        
        var grabCanvas = document.getElementById("screengrab_buffer_canvas");
        grabCanvas.width = width;
        grabCanvas.style.width = styleWidth;
        grabCanvas.style.maxWidth = styleWidth;
        grabCanvas.height = height;
        grabCanvas.style.height = styleHeight;
        grabCanvas.style.maxHeight = styleHeight;
    
        return grabCanvas;
    }
}