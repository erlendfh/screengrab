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
SGJavaGrab = {
    JavaGrab : function() {
    },
    
    grabShot : function(robot, x, y, width, height) {
        var theImage = robot.createScreenCapture(new java.awt.Rectangle(x, y, width, height));
        return theImage;
    },
    
    /*
    getSystemImageType - returns the screen image type (as specified by java) on the system
            robot - the robot we will use to get the image type
            returns an int containing the java image type

        Sort of a cheat to get the image type of the display we're on in java's format.
        There's probably a nicer way, but this seems to work quite well.
    */
    getSystemImageType : function(robot) {
        return SGJavaGrab.grabShot(robot, 0, 0, 1, 1).getType();
    },

    /*
        saveImage - saves an image to the file system
        
            image - the java.awt.image.BufferedImage to save
            format - the type of graphics file to save the image as
            filePath - the full system path location to save the file at
    */
    saveImage : function(image, format, filePath) {
        jPath = new java.lang.String(filePath);
        if (!jPath.endsWith("." + format)) {
            jPath = jPath + "." + format;
        }
        var file = new java.io.File(jPath);
        Packages.javax.imageio.ImageIO.write(image, format, file);
    },

    grabAsMethod : function(x, y, width, height, documentWidth, documentHeight) {
        return (function() {
            SGJavaGrab.grab(x, y, width, height, documentWidth, documentHeight);
        });
    },


    /*
        grab - takes a screenshot of the area specified.
                If the specified document dimensions are larger than the 
                specified width/height, tries to scroll around and stitch
                together a larger version of the document.
                
            x - distance from the left edge of the screen to start grab
            y - distance from the top edge of the screen to start grab
            width - width of area to grab
            height - height of area to grab
            documentWidth - width of document to attemp to grab in chunks
            documentHeight - height of document to attemp to grab in chunks
    */
    grab : function(x, y, width, height, documentWidth, documentHeight) {
        var numSectionsX = Math.floor(documentWidth / width);
        var numSectionsY = Math.floor(documentHeight / height);
        var overRunX = documentWidth - (numSectionsX * width);
        var overRunY = documentHeight - (numSectionsY * height);
        
        var timeToWait = 10;
        if (SGNsUtils.isMac()) {
            // slow down the grab for macs
            timeToWait = 50;
        }
        
        if (overRunX > 0) {
            numSectionsX++;
        }
        
        if (overRunY > 0) {
            numSectionsY++;
        }
        
        var state = new Object();
        state.origScrollX = SGNsUtils.getActiveFrame().document.scrollX;
        state.origScrollY = SGNsUtils.getActiveFrame().document.scrollY;
        state.width = width;
        state.height = height;
        
        var counter = new Object();
        counter.limit = numSectionsX * numSectionsY;
        counter.count = 0;
        
        var grabX = x;
        var grabY = y;
        
        try {
            // make a robot to take the grab
            var robot = new java.awt.Robot();
            robot.setAutoWaitForIdle(true); // thanks to Dominic Letz, 
            
            // make the big raster to hold the image as we create it
            state.bigImage = new java.awt.image.BufferedImage(documentWidth, documentHeight, SGJavaGrab.getSystemImageType(robot));
            state.bigRaster = state.bigImage.getRaster();
            
            // The following sets up a number of scroll and shoot closures.
            // These will be executed in serial after they have been set up.
            // Each shot will scroll, wait and shoot.
            // The reason for this is that on the mac the time taken to scroll is sometimes 
            // faster than the time taken to call out to Java and get it to take the shot,
            // so we need to actually wait to make SURE that the page has scrolled into the right place
            // before we take the picture.
            // This may not be a problem on faster Macs, but I think this code is best.
            // The timeOut needs to be made configurable though.
            var shots = new Array();
            var scrolls = new Array();
            for (var i = 0; i < numSectionsX; i++) {
                for (var j = 0; j < numSectionsY; j++) {
                    var grabX = x;
                    var grabY = y;
                    var grabWidth = width;
                    var grabHeight = height;
                    
                    if (i == (numSectionsX - 1) && (overRunX > 0)) {
                        grabWidth = overRunX;
                        grabX = x + (width - overRunX);
                    }
                    if (j == (numSectionsY - 1) && (overRunY > 0)) {
                        grabHeight = overRunY;
                        grabY = y + (height - overRunY);
                    }
                    
                    shots.push(SGJavaGrab.takeShot(state, grabX, grabY, grabWidth, grabHeight, robot, i, j, counter));
                    if (numSectionsX != 1 || numSectionsY != 1) {
    	                scrolls.push(SGJavaGrab.makeScroll(i, j, width, height));
    	            }
                }
            }
            SGJavaGrab.chainShots(shots, scrolls, true, timeToWait);
        } catch (ex) {
            SGNsUtils.getActiveFrame().scrollTo(state.origScrollX, state.origScrollY);
            SGJavaGrab.handleError(ex);
        }
    },
    
    chainShots : function(shots, scrolls, first, timeOut) {
        if (shots.length == 0) {
            return;
        }
        
        if (first == true) {
            SGJavaGrab.scrollsShift(scrolls);
            setTimeout(SGJavaGrab.callChainShots(shots, scrolls, false, timeOut), timeOut);
        } else {
            shots.shift()();
            SGJavaGrab.scrollsShift(scrolls);
            setTimeout(SGJavaGrab.callChainShots(shots, scrolls, false, timeOut), timeOut);
        }
    },
    
    callChainShots : function(shots, scrolls, first, timeOut) {
        return (function() {
            SGJavaGrab.chainShots(shots, scrolls, first, timeOut);
        });
    },

    scrollsShift : function(scrolls) {
        if (scrolls.length > 0) {
            scrolls.shift()();
        }
    },
    
    makeScroll : function(i, j, width, height) {
        return (function() {
              SGNsUtils.getActiveFrame().scrollTo(i * width, j * height);
        });
    },
    
    takeShot : function(state, x, y, w, h, robot, i, j, counter) {
        return (function() {
            try {   
                var newTile = SGJavaGrab.grabShot(robot, x, y, w, h);
                state.bigRaster.setRect(i * state.width, j * state.height, newTile.getRaster());
                counter.count++;
                SGJavaGrab.attemptToFinish(state, counter);
            } catch (ex) {
                SGNsUtils.getActiveFrame().scrollTo(state.origScrollX, state.origScrollY);
                SGJavaGrab.handleError(ex);       
            }
        });
   },
   
    /*
      will finish if the counter has reached the end
    */
    attemptToFinish : function(state, counter) {
        if (counter.limit != counter.count) {
            return;
        } else if (counter.limit != 1) {
    	    SGNsUtils.getActiveFrame().scrollTo(state.origScrollX, state.origScrollY);
    	}
        
        var nsFile = SGNsUtils.askUserForFile(Screengrab.defaultFileName());
        if (nsFile != null) {
         	var filePath = nsFile.path;
           SGJavaGrab.saveImage(state.bigImage, Screengrab.format(), filePath);
        }
    },

    handleError : function(error) {
        var stringVal = "" + error;
        var msg = "";
        if (stringVal.indexOf("java.") != -1) {
            // java exception
            if (error.getClass().equals(java.lang.OutOfMemoryError)) {
                msg = document.getElementById("screengrab-strings").getString("OutOfMemoryMessage");
            } else if (error.getClass().equals(java.security.PrivilegedActionException)) {
                msg = document.getElementById("screengrab-strings").getString("PrivilegedActionMessage");
            } else {
                msg = document.getElementById("screengrab-strings").getString("TryAgainMessage");
            }
        } else if (stringVal.indexOf("null instance") != -1) {
            msg = document.getElementById("screengrab-strings").getString("NullInstanceMessage");
        } else if (stringVal.indexOf("java") != -1) {
            msg = document.getElementById("screengrab-strings").getString("JavaNotFoundMessage");
        } else {
            msg = document.getElementById("screengrab-strings").getString("TryAgainMessage");
        }
        alert(msg + error);
    }
}

SGJavaGrab.JavaGrab.prototype = {
    grabPage : function() {
        var frameDim = new SGDimensions.FrameDimensions();
        var width = frameDim.getDocumentWidth();
        var height = frameDim.getDocumentHeight();
        if (frameDim.getFrameWidth() > width) width = frameDim.getFrameWidth();
        if (frameDim.getFrameHeight() > height) height = frameDim.getFrameHeight();
        
        setTimeout(SGJavaGrab.grabAsMethod(frameDim.getScreenX(), 
                            frameDim.getScreenY(),
                            frameDim.getFrameWidth(),
                            frameDim.getFrameHeight(),
                            width,
                            height), 100);
    },
    
    grabSelection : function(grabBox) {
        var viewDim = new SGDimensions.BrowserViewportDimensions();
    	setTimeout(SGJavaGrab.grabAsMethod(viewDim.getScreenX() + grabBox.getX(), 
                                viewDim.getScreenY() + grabBox.getY(),
                                grabBox.getWidth(),
                                grabBox.getHeight(),
                                grabBox.getWidth(),
                                grabBox.getHeight()), 100);
    },
    
    grabVisiblePage : function() {
        var viewDim = new SGDimensions.BrowserViewportDimensions();
        setTimeout(SGJavaGrab.grabAsMethod(viewDim.getScreenX(), 
                                viewDim.getScreenY(),
                                viewDim.getWidth(),
                                viewDim.getHeight(),
                                viewDim.getWidth(),
                                viewDim.getHeight()), 100);
    },
    
    grabBrowser : function() {
        var viewDim = new SGDimensions.BrowserWindowDimensions();
        setTimeout(SGJavaGrab.grabAsMethod(viewDim.getScreenX(), 
                                viewDim.getScreenY(),
                                viewDim.getWidth(),
                                viewDim.getHeight(),
                                viewDim.getWidth(),
                                viewDim.getHeight()), 100);
    }
}
