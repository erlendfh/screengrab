
screengrab.Highlighter = function(contentWindow, highlightSelectedHandler) {
    this.undoSet = new screengrab.UndoSet();
	this.styleUndoSet = new screengrab.UndoSet();
	
    var moveListener = this.createOutliner(this.styleUndoSet);
	var upListener = this.createFinishHandler(this, highlightSelectedHandler);
	
	var contentDocs = new screengrab.Document(contentWindow.document).getDocuments(contentWindow);
	this.addListenersToDocument(contentDocs, upListener, moveListener);
}
screengrab.Highlighter.prototype = {
	addListenersToDocument : function(documents, mouseUp, mouseMove) {
		for (var i = 0; i < documents.length; i++) {
	        documents[i].addEventListener("mousemove", mouseMove, true);
	        this.undoSet.pushRemoveEventListener("mousemove", mouseMove, documents[i]);
	        
	        documents[i].addEventListener("mouseup", mouseUp, true);
	        this.undoSet.pushRemoveEventListener("mouseup", mouseUp, documents[i]);
	    }
	},
	createFinishHandler : function(me, finishHandler) {
		return function(event) {
			me.undoSet.undo();
			me.styleUndoSet.undo();
			finishHandler(event);
		};
	},
	createOutliner : function(styleUndo) {
	    var outliner = function(event) {
	        if (event.target && event.target != this.highlighted) {
	            this.highlighted = event.target;
	            styleUndo.popAndRun();
	            
	            var orig = event.target.style.MozOutline;
	            styleUndo.pushPropertyChange(event.target.style, "MozOutline", orig);
	            event.target.style.MozOutline = "1px solid #ff0000";
	        }
	    };
	    return outliner;
    }
}
     
    