
screengrab.Document = function(myDocument) {
    this.doc = myDocument;
    this.undos = new screengrab.UndoSet();
}

screengrab.Document.prototype = {
	
    getDocuments : function(contentWin) {
        var contentDocs = new Array();
        for (var i = 0; i < contentWin.frames.length; i++) {
            contentDocs = contentDocs.concat(this.getDocuments(contentWin.frames[i]));
        }
        contentDocs.push(contentWin.document);
        return contentDocs;
    },
    
	getDimensionsOf : function(element) {
		var box = element.ownerDocument.getBoxObjectFor(element);
		var sgBox = new screengrab.Box(box.x, box.y, box.width, box.height)
		sg.debug(element + " " + sgBox);
		return sgBox;
    },
    
    head : function() {
        var heads = this.doc.getElementsByTagName("head");
        if (heads.length == 0) {
            var body = doc.getElementsByTagName("html")[0];
            var head = doc.createElement("head");
            body.appendChild(head);            
            this.undos.pushRemoveFromParent(head, body);
        }
        return this.doc.getElementsByTagName("head")[0];
    },
    
    includeScript : function(id, url) {
        var script = this.doc.createElement("script");
		script.id = id;
		script.language = "JavaScript";
		script.type = "text/javascript";
		script.src = url;
        var head = this.head();
        head.appendChild(script);
        this.undos.pushRemoveFromParent(script, head);
    },
    
    includeStyle : function(id, url) {
        var css = this.doc.createElement("link");
		css.id = id;
		css.rel = "stylesheet";
		css.type = "text/css";
		css.href = url;
        var head = this.head();
        head.appendChild(css);
        this.undos.pushRemoveFromParent(css, head);
    },
    
    setAllFlashOpaque : function() {
		try {
	        var embedded = this.doc.getElementsByTagName("embed");
	        for (var i = 0; i < embedded.length; i++) {
	            var embed = embedded[i];
	            var orig = embed.getAttribute("wmode");
	            var parent = embed.parentNode;
	            embed.setAttribute("wmode", "opaque");
	            parent.removeChild(embed);
	            parent.appendChild(embed);
	            this.undos.push(function() {
	                embed.setAttribute("wmode", orig);
	                parent.removeChild(embed);
	                parent.appendChild(embed);
	            });
	        }
		} catch (e) {
			sg.error(e);
		}
    },
	
	getAllEmbeddedDimensions : function() {
		var boxesToGrab = new Array();
		var me = this;
		fill = function(elements) {
			for (var i = 0; i < elements.length; i++) {
				boxesToGrab.push(me.getDimensionsOf(elements[i]));
			}
		}
		fill(this.doc.getElementsByTagName("applet"));
        fill(this.doc.getElementsByTagName("object"));
        fill(this.doc.getElementsByTagName("embed"));
		return boxesToGrab;
	},
	
    undo : function() {
        this.undos.undo();
    }
}
