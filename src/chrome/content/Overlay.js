screengrab.ImageOverlay = function() {}
screengrab.ImageOverlay.prototype = {
	overlay: function() {
		this.canvas = document.createElementNS("http://www.w3.org/1999/xhtml", "html:canvas");
		this.context = this.canvas.getContext("2d");
	}
}