
screengrab.CaptureViewPort = function(browser, dimensions, onCaptured) {
    var htmlDoc = browser.getDocument();
    htmlDoc.setAllFlashOpaque();
    var canvas = browser.getFilledCanvas(dimensions);
    htmlDoc.undo();
    
    var embeddedCapture = new screengrab.EmbeddedCapture(htmlDoc, dimensions, canvas.getContext("2d"));
    embeddedCapture.capture(function() {
		onCaptured(canvas);
    }, browser);
}

screengrab.CaptureWindow = function(browser, dimensions, onCaptured) {
	window.setTimeout(function() {
		var dataUrl = screengrab.Java.capture(dimensions);
		var canvas = browser.getCanvas();
		var context = browser.prepareCanvas(canvas, dimensions);
		var img = new Image();
		img.onload = function() {
			try {
				context.drawImage(img, 0, 0);
				context.restore();
				onCaptured(canvas);
			} catch (error) {
				sg.error(error);
			}
		}
		img.src = dataUrl;
	}, 100);
}