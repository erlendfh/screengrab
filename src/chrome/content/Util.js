/**
 * @author andy
 */
screengrab.Util = {
	clonePopup : function(event, popupSourceId, expectedParentId) {
		var popup = event.target;
		if (popup.parentNode.id != expectedParentId) return;
		var primary = document.getElementById(popupSourceId);
		for (var i = 0; i < primary.childNodes.length; i++) {
			popup.appendChild(primary.childNodes[i].cloneNode(true));
		}
	},

	clearPopup : function(event, expectedParentId) {
		var popup = event.target;
		if (popup.parentNode.id != expectedParentId) return;
		while (popup.hasChildNodes()) {
			popup.removeChild(popup.firstChild);
		}
	}	
}
