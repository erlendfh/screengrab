/**
 * @author andy
 */
screengrab.Grab = function(target, capture, action) {
	try {
		target.obtainDimensions(function(browser, dimensions) {
			capture(browser, dimensions, function(canvas) {
				action.doAction(canvas);
			});
		});
	} catch (error) {
		screengrab.error(error);
	}
}
screengrab.Grab2 = function(targetName, captureName, action) {
    try {
		// bring focus to us
		screengrab.Browser.contentFrame().focus();
		var target = eval("new sg." + targetName + "()");
		var capture = eval("sg." + captureName);
        target.obtainDimensions(function(browser, dimensions) {
            capture(browser, dimensions, function(canvas) {
                action(canvas);
            });
        });
    } catch (error) {
        screengrab.error(error);
    }
}
screengrab.StagedGrab2 = function() {
    try {
		var choices = {target: null, capture: "CaptureViewPort", action: null};
        window.openDialog("chrome://screengrab/content/TargetChoice.xul", "targetChoice", "centerscreen,modal",
		                  {choices: choices});
		choices.target = eval("new sg." + choices.target + "()");
		choices.capture = eval("sg." + choices.capture);
		choices.target.obtainDimensions(function(browser, dimensions) {
			choices.capture(browser, dimensions, function(canvas) {
                window.openDialog("chrome://screengrab/content/ActionChoice.xul", "actionChoice", "centerscreen,modal",
				                    {choices: choices});
				choices.action = eval("new sg." + choices.action + "()");
				choices.action.doAction(canvas);
            });
		});
    } catch (error) {
        screengrab.error(error);
    }
}
screengrab.StagedGrab = function(target, capture) {
    try {
        target.obtainDimensions(function(browser, dimensions) {
			capture(browser, dimensions, function(canvas) {
				// make sure that the canvas is obtainable via this.opener.canvas...
				this.canvas = canvas;
				window.open("chrome://screengrab/content/ActionChoice.xul", "actionChoice", "chrome,centerscreen",
				            {canvas: canvas});
            });
        });
    } catch (error) {
        screengrab.error(error);
    }
}
screengrab.FinishGrab = function(action, canvas) {
	action.doAction(canvas);
}