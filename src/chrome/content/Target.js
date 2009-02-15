/**
 * Defines a capture target for screengrab.
 */
screengrab.Target = function() {
	this.contentBrowser = null;
	this.dimensions = null;
}
screengrab.Target.prototype = {
	getBrowser : function() {
		return this.contentBrowser;
	},
	getDimensions : function() {
		return this.dimensions;
	},
	obtainDimensions : function(onObtained) {
		if (onObtained) {
			try {
	    		onObtained(this.contentBrowser, this.dimensions);
			} catch (error) {
				dump(error);
			}
		}
	}
}

/**
 * Target to capture the entire window - this will give screen coords
 */
screengrab.WindowTarget = function() {}
screengrab.WindowTarget.superclass = screengrab.Target.prototype;
screengrab.WindowTarget.prototype = {
    obtainDimensions : function(onObtained) {
		// the browser doesn't matter, just fill it in to avoid any potential nulls...
        this.contentBrowser = new screengrab.Browser(screengrab.Browser.contentWindow());
        this.dimensions = screengrab.Browser.physicalDimensions();
        screengrab.Target.prototype.obtainDimensions.call(this, onObtained);
    }
}

/**
 * Target to capture the entire contents of a frame
 */
screengrab.FrameTarget = function() {}
screengrab.FrameTarget.superclass = screengrab.Target.prototype;
screengrab.FrameTarget.prototype = {
	obtainDimensions : function(onObtained) {
	    this.contentBrowser = new screengrab.Browser(screengrab.Browser.contentFrame());
	    this.dimensions = this.contentBrowser.getCompletePageRegion();
		screengrab.Target.prototype.obtainDimensions.call(this, onObtained);
	}
}
/**
 * Target to capture the visible contents of a window
 */
screengrab.VisibleTarget = function() {}
screengrab.VisibleTarget.superclass = screengrab.Target.prototype;
screengrab.VisibleTarget.prototype = {
    obtainDimensions : function(onObtained) {
        this.contentBrowser = new screengrab.Browser(screengrab.Browser.contentWindow());
        this.dimensions = this.contentBrowser.getVisibleDocumentRegion();
        screengrab.Target.prototype.obtainDimensions.call(this, onObtained);
    }
}
/**
 * Target to capture the entire screen
 */
screengrab.ScreenTarget = function() {}
screengrab.ScreenTarget.superclass = screengrab.Target.prototype;
screengrab.ScreenTarget.prototype = {
    obtainDimensions : function(onObtained) {
        this.contentBrowser = new screengrab.Browser(screengrab.Browser.contentWindow());
        this.dimensions = new screengrab.Box(0, 0, screen.width, screen.height);
        screengrab.Target.prototype.obtainDimensions.call(this, onObtained);
    }
}

/**
 * Target to capture a user specified selection of a window
 */
screengrab.SelectionTarget = function() {
	this.contentBrowser = new screengrab.Browser(screengrab.Browser.contentWindow());
}
screengrab.SelectionTarget.superclass = screengrab.Target.prototype;
screengrab.SelectionTarget.prototype = {
	obtainDimensions : function(onObtained) {
		var me = this;
		var viewport = screengrab.Browser.contentWindow();
        SGSelection.browser = new screengrab.Browser(viewport);
		SGSelection.callback = function(dimensions) {
			me.dimensions = dimensions.offsetCopy(viewport.scrollX, viewport.scrollY);
            screengrab.Target.prototype.obtainDimensions.call(me, onObtained);
		}
        SGSelection.toggleDraw();
    }
}

/**
 * Target to capture a specific DOM element in the browser
 */
screengrab.ElementTarget = function() {
	this.contentBrowser = new screengrab.Browser(screengrab.Browser.contentWindow());
}
screengrab.ElementTarget.superclass = screengrab.Target.prototype;
screengrab.ElementTarget.prototype = {
	obtainDimensions : function(onObtained) {
		var me = this;
		new screengrab.Highlighter(
			screengrab.Browser.contentWindow(), // the current tab window
			function(event) {
				me.contentBrowser = new screengrab.Browser(screengrab.Browser.frameFor(event.target));
				me.dimensions = me.contentBrowser.getDocument().getDimensionsOf(event.target);
                screengrab.Target.prototype.obtainDimensions.call(me, onObtained);
			});
	}
}
