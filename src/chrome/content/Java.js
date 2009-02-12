/**
 * @author 602527127
 */
screengrab.Java = {
	clForJar : new Object(),
	
	getStackTrace: function(e) {
		if (e.printStackTrace == undefined) {
			return e;
		}
        var baos = new java.io.ByteArrayOutputStream();
        var ps = new java.io.PrintStream(baos);
        e.printStackTrace(ps);
        ps.close();
        return baos.toString();
    },
    newArray: function(type) {
        var arrayLen = arguments.length - 1;
        var array = java.lang.reflect.Array.newInstance(java.lang.Class.forName(type), arrayLen);
        for (var i = 0; i < arrayLen; i++) {
            array[i] = arguments[i + 1];
        }
        return array;
    },
    getClass: function(className, jar) {
        try {
			var jarCl = this.clForJar[jar];
			if (jarCl == null) {
				screengrab.debug("Creating class loader for " + jar);
		        var id = "{02450954-cdd9-410f-b1da-db804e18c671}";
		        var ext = Components.classes["@mozilla.org/extensions/manager;1"].getService(Components.interfaces.nsIExtensionManager).getInstallLocation(id).getItemLocation(id);
				var file = new java.io.File(ext.path + "/components/" + jar).getAbsoluteFile();
	            jarCl = java.net.URLClassLoader.newInstance(this.newArray("java.net.URL", file.toURL()));
				this.clForJar[jar] = jarCl;
			}
            var aClass = java.lang.Class.forName(className, true, jarCl);
            screengrab.debug("Returning " + aClass.getName());
            return aClass;
        } catch (e) {
            screengrab.error(this.getStackTrace(e));
        }
        return null;
    },
	isAvailable: function() {
		try {
			new java.lang.Integer(1);
			return true;
		} catch (error) {
			return false;
		}
	},
	capture: function(box) {
		screengrab.debug(box);
		var clazz = this.getClass("Base64$OutputStream", "base64.jar");
		var baos = new java.io.ByteArrayOutputStream();
		var constructor = clazz.getConstructor(this.newArray("java.lang.Class", java.lang.Class.forName("java.io.OutputStream")));
		var b64os = constructor.newInstance(this.newArray("java.io.OutputStream", baos));
		
		var robot = new java.awt.Robot();
		robot.setAutoWaitForIdle(true);
		
		var image = robot.createScreenCapture(new java.awt.Rectangle(box.x, box.y, box.width, box.height));
		Packages.javax.imageio.ImageIO.write(image, "png", b64os);
		b64os.close();
		return "data:image/png;base64," + baos.toString();
	}
}
