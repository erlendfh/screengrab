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
SGSelection = {
    BACKGROUND_DIV : "screengrabBackgroundDiv",
    DRAW_DIV : "screengrabDrawDiv",
    BOX_DIV : "screengrabBoxDiv",
    IDLE_IMAGE : "url('chrome://screengrab/skin/idle.png') 0 no-repeat",
    SNAP_IMAGE : "url('chrome://screengrab/skin/snap.png') 0 no-repeat",
    TOOL_TEXT : "Grab/Cancel",
    oldText : null,
    drawing : false,
    
    toggleDraw : function(toClipboard) {
        if (this.drawing) {
            this.disableDrawAndGrabIfRequired();
        } else {
            this.toClipboard = toClipboard;
            this.enableDraw();
        }
    },
    
    insertHeaderElements : function() {
        var x = window._content;
        var pageHead = x.document.getElementsByTagName("head")[0];
    
        if (pageHead == null) { // if page head doesn't exist, create one
          var pageBody = x.document.getElementsByTagName("html")[0];
          var pageHead = x.document.createElement("head");
    
          pageBody.appendChild(pageHead);
    
          var pageHead = x.document.getElementsByTagName("head")[0];
        }
    
        var cssCheck = x.document.getElementById("screengrab_css");
        var jsCheck = x.document.getElementById("screengrab_js");
    
        if (cssCheck == null) { // insert stylesheet reference
          var css = x.document.createElement("link");
          css.setAttribute("id", "screengrab_css");
          css.setAttribute("rel", "stylesheet");
          css.setAttribute("type", "text/css");
          css.setAttribute("href", "chrome://screengrab/skin/screengrab.css");
    
          pageHead.appendChild(css);
        }
    
        if (jsCheck == null) { // insert javascript reference
          var js = x.document.createElement("script");
          js.setAttribute("id", "screengrab_js");
          js.setAttribute("language", "JavaScript");
          js.setAttribute("type", "text/javascript");
          js.setAttribute("src", "chrome://screengrab/content/selectionBox.js");
    
          pageHead.appendChild(js);
        }
    },
    
    enableDraw : function() {
    	var screengrabBar = window.document.getElementById("screengrab_bar");
    	if (screengrabBar != null) {
    		screengrabBar.style.background = this.SNAP_IMAGE;
    		this.oldText = screengrabBar.tooltiptext;
    		screengrabBar.tooltiptext = this.TOOL_TEXT;
    	}
    
    	this.insertHeaderElements();
    	var winCon = window._content;
    
        var body = winCon.document.getElementsByTagName("html")[0];
        
        var drawDiv = winCon.document.createElement("div");
        drawDiv.setAttribute("id", this.DRAW_DIV);
        
        var backgroundDiv = winCon.document.createElement("div");
        backgroundDiv.setAttribute("id", this.BACKGROUND_DIV);
        backgroundDiv.setAttribute("class", "backgroundOverlay");
        backgroundDiv.setAttribute("onmousedown", "beginBoxDraw(event)");
        
        drawDiv.appendChild(backgroundDiv);
        body.appendChild(drawDiv);
        
        window._content.document.addEventListener("mouseup", SGSelectionOnMouseUpHandlerThatHasToExistForSomeReason, true);
        this.drawing = true;
    },
    
    disableDrawAndGrabIfRequired : function(event) {
        window._content.document.removeEventListener("mouseup", SGSelectionOnMouseUpHandlerThatHasToExistForSomeReason, true);
        var winCon = window._content;
    	var dimBox = null;
    	// create a box to hold the dimensions of the box
    	var box = winCon.document.getElementById(this.BOX_DIV);
    	if (box != null) {
    	    dimBox = new SGDimensions.Box(box.offsetLeft, box.offsetTop, box.clientWidth, box.clientHeight);
    	}
    	// remove the box div
        var body = winCon.document.getElementsByTagName("html")[0];
        var newDiv = winCon.document.getElementById(this.DRAW_DIV);
        body.removeChild(newDiv);
    	
    	// restore the styling to the screengrab bar
    	var screengrabBar = window.document.getElementById("screengrab_bar");
    	if (screengrabBar != null) {
    		screengrabBar.style.background = this.IDLE_IMAGE;
    		screengrabBar.tooltiptext = this.oldText;
    	}
    	
    	this.drawing = false;
    	
    	// take the shot (hopefully everything is clean now)
    	if (box != null && event != null) {
    	    if (this.toClipboard) {
    	        Screengrab.copyDocumentPortion(dimBox.getX(), dimBox.getY(), dimBox.getWidth(), dimBox.getHeight());
    	    } else {
        		Screengrab.grabDocumentPortion(dimBox.getX(), dimBox.getY(), dimBox.getWidth(), dimBox.getHeight());
    	    }
    	}
    }
}

function SGSelectionOnMouseUpHandlerThatHasToExistForSomeReason(event) {
    SGSelection.disableDrawAndGrabIfRequired(event);
}