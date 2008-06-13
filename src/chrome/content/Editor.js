
screengrab.Editor = {
	replaceChar : "_",
    fileNameRegEx : new RegExp('[,/\:*?""<>|]', 'g'),
	
	grab : function(target, capture) {
		var mainWindow = window.opener;
		var that = this;
		var thatWindow = window;
		mainWindow.sg.Grab2(target, capture, function(canvas) {
			var doc = window.opener.sg.Browser.contentDocument();
			thatWindow.focus();
			that.canvas = canvas;
			that.sourceUri = doc.URL;
			that.title = doc.title;
			document.getElementById('fileName').value = doc.title.replace(this.fileNameRegEx, this.replaceChar);
			that.fillImage(canvas);
		});
	},
	
	doAction : function(actionName) {
		var action = eval(" new window.opener.sg." + actionName + "()");
		action.doAction(this.canvas);
	},
	
	fillImage: function(canvas) {
		var image = document.getElementById("grabbedImage");
        var width = canvas.width;
		var height = canvas.height;
		
		if (width < 500) {
			xScale = 1;
		} else {
			xScale = 500 / width;
		}
		if (height < 500) {
			yScale = 1;
		} else {
			yScale = 500 / height;
		}
		var scale = xScale < yScale ? xScale : yScale;
		image.width = canvas.width * scale;
		image.height = canvas.height * scale;
		image.src = canvas.toDataURL("image/png", "");
		
		var dimensions = document.getElementById("dimensions");
		dimensions.value = canvas.width + "x" + canvas.height;
		
		var zoom = document.getElementById("zoom");
		zoom.value = Math.round(scale * 100) + "%";
		window.sizeToContent();
	},
	
	doScrnShotsUpload: function() {
		var shotData = new window.opener.sg.ScrnShots.ShotData();
		shotData.fileName = document.getElementById('fileName').value;
		shotData.tags = "";
		shotData.description = this.title;
		shotData.sourceUri = this.sourceUri;
		window.openDialog("chrome://screengrab/content/ScrnShotsUpload.xul", "scrnshots", "chrome,centerscreen,modal", {shotData: shotData});
		var action = new window.opener.sg.UploadScrnshotsAction(shotData);
		action.doAction(this.canvas);
	}
}