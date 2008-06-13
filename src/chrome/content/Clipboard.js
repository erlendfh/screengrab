screengrab.Clipboard = {
    putImgDataUrl : function(dataUrl, callbackWhenDone) {
        var image = window.content.document.createElement("img");
        image.setAttribute("style", "display: none");
        image.setAttribute("id", "screengrab_buffer");
        image.setAttribute("src", dataUrl);
        var body = window.content.document.getElementsByTagName("html")[0];
        body.appendChild(image);
        setTimeout(this.copyImage(image, body, document, callbackWhenDone), 200);
    },
    
    copyImage : function(image, body, documenty, callbackWhenDone) {
        return function () {
            documenty.popupNode = image;
            try {
                goDoCommand('cmd_copyImageContents');
            } catch (ex) {
                alert(ex);
            }
            body.removeChild(image);
            if (callbackWhenDone) {
                callbackWhenDone();
            }
        };
    }
}