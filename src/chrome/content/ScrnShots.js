
screengrab.ScrnShots = function(user, pass) {
	this.user = user;
	this.pass = pass;
};
screengrab.ScrnShots.prototype = {
	getTags: function() {
		var req = new XMLHttpRequest();
		req.open("GET", "http://www.scrnshots.com/users/" + this.user + "/tags.XML", true);
        req.overrideMimeType('text/xml');
		req.onreadystatechange = function() {
            if (req.readyState == 4 && req.status == 200) {
				var names = req.responseXML.getElementsByTagName('name');
				var tags = names.map(new function(name) {
					return name.childNodes[0].nodeValue;
				});
				return tags;
            }
			throw "Couldn't get tags";
        }
		req.send(null);
	},
	
	upload: function(shotData, onUploaded) {
		var boundStr = '---------------------------265001916915724';
        var boundary = '--' + boundStr;
        var req = new XMLHttpRequest();
        var bodyStart = 
            boundary + "\r\n" +
            'Content-Disposition: form-data; name="screenshot[description]"' + "\r\n" +
            "\r\n" +
            shotData.description + "\r\n" +
            boundary + "\r\n" +
            'Content-Disposition: form-data; name="screenshot[tag_list]"' + "\r\n" +
            "\r\n" +
            shotData.tags + "\r\n" +
            boundary + "\r\n" +
            'Content-Disposition: form-data; name="screenshot[source_url]"' + "\r\n" +
            "\r\n" +
            shotData.sourceUri + "\r\n" +
            boundary + "\r\n" +
            'Content-Disposition: form-data; name="screenshot[uploaded_data]"; filename="' + shotData.uploadFilename + '"' + "\r\n" +
            'Content-Type: image/png' + "\r\n" +
            "\r\n";
        var bodyStartStream = new sg.File.StringInputStream(bodyStart, bodyStart.length);
        var fileStream = shotData.file.getBufferedStream();
        var bodyEnd = 
            "\r\n" +
            boundary + "--";
        var bodyEndStream = new sg.File.StringInputStream(bodyEnd, bodyEnd.length);
        
        var multiplexed = new sg.File.MultiplexInputStream();
        multiplexed.appendStream(bodyStartStream);
        multiplexed.appendStream(fileStream);
        multiplexed.appendStream(bodyEndStream);
        var length = bodyStartStream.available() + fileStream.available() + bodyEndStream.available(); 
        req.open("POST", "http://www.scrnshots.com/screenshots.xml", true);
        req.setRequestHeader("Authorization", "Basic " + this.getAuthHeader());
        req.setRequestHeader("Content-type", "multipart/form-data; boundary=" + boundStr);
        req.setRequestHeader("Content-Length", length);
        req.setRequestHeader("Connection", "close");
        req.overrideMimeType('text/xml');
        req.onreadystatechange = function() {
            if (req.readyState == 4) {
                var links = req.responseXML.getElementsByTagName('link');
                if (links.length != 1) {
                    alert("Something went wrong...");
                } else {
                    gBrowser.selectedTab = gBrowser.addTab(links[0].childNodes[0].nodeValue);
                }
                shotData.file.remove();
            }
        }
        req.send(multiplexed);
	},
	getAuthHeader: function(){
		return "Basic " + sg.Base64.encode(this.user + ":" + this.pass);
	}
}
screengrab.ScrnShots.ShotData = function() {
	this.file = null;
	this.tags = "";
	this.description = "";
    this.sourceUri = "";
	this.uploadFilename = "";
}