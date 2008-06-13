screengrab.UndoSet = function() {
    this.undos = new Array();
}
screengrab.UndoSet.prototype = {
    
    popAndRun : function() {
		if (this.undos.length == 0) return;
		var func = this.undos.pop();
        func();
    },
    
    push : function(func) {
        this.undos.push(func);
    },
    
    pushPropertyChange : function(object, property, value) {
        this.undos.push(function() {
            object[property] = value;
        });
    },
    
    pushRemoveEventListener : function(name, listener, parent) {
        this.undos.push(function() {
            parent.removeEventListener(name, listener, true);
        });
    },
    
    pushRemoveFromParent : function(child, parent) {
        this.undos.push(function() {
            parent.removeChild(child);
        });
    },
    
    undo : function() {
        while (this.undos.length > 0) {
            try {
                this.popAndRun();
            } catch (error) {
				screengrab.error(error);
			}
        }
    }
}
