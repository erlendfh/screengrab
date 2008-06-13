
screengrab.EmbeddedCapture = function(htmlDoc, captureBox, context) {
	this.context = context;
	this.captureBox = captureBox;
	// only get the embeds that are in the area to capture
	var toCopy = htmlDoc.getAllEmbeddedDimensions()
                   .filter(function(element) {
				   	   return element.intersects(captureBox)
					});
	
	var regions = new Array();
	var viewportDimensions = screengrab.Browser.viewportAbsoluteDimensions();
	toCopy.forEach(function(element) {
		// only want to capture the bit that's in the target area
		var intersection = element.intersection(captureBox);
		
		// split the embeds so that they will fit into the window
		var split = intersection.toBoxesSmallerThan(viewportDimensions.width, viewportDimensions.height);
		sg.debug("Split... " + split);
        regions = regions.concat(split);
    });
	this.regions = regions;
}
screengrab.EmbeddedCapture.prototype = {
	capture: function(onFinish, htmlWindow) {
		if (this.regions.length == 0) {
			onFinish();
			return;
		}
		var viewportDimensions = screengrab.Browser.viewportAbsoluteDimensions();
		var context = this.context;
		var regions = this.regions;
        var img = new Image();
		var box = new sg.Box(0, 0);
		var win = htmlWindow.htmlWin;
		var origScrollX = win.scrollX;
		var origScrollY = win.scrollY;
		var captureBox = this.captureBox;
		
		var nextImage = function() {
            sg.debug(regions.length);
            var element = regions.pop();
			box.x = element.x;
			box.y = element.y;
			var visibleRegion = new screengrab.Box(win.scrollX, win.scrollY, viewportDimensions.width, viewportDimensions.height);
			if (!visibleRegion.contains(box)) {
	            // scroll to region, snap it and save it
				win.scrollTo(box.x, box.y);
			}
			
            var copy = element.offsetCopy(viewportDimensions.x - win.scrollX, viewportDimensions.y - win.scrollY);
            var dataUrl = screengrab.Java.capture(copy);
            sg.debug("Setting url");
            img.src = dataUrl;
        }
		
		img.onload = function() {
            sg.debug("onLoad hit");
            context.save();
            context.drawImage(img, box.x - captureBox.x, box.y - captureBox.y);
            context.save();
            if (regions.length != 0) {
                sg.debug("Next");
                nextImage();
            } else {
				sg.debug("Finishing");
                win.scrollTo(origScrollX, origScrollY);
                onFinish();
            }
		}
		nextImage();
	}
}