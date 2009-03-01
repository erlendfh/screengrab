/**
 * @author andy
 */
try {
	// configure logging (will be loaded into screengrab.log4js)
	screengrab.log4js = {};
	screengrab.ScriptLoader.loadSubScript("chrome://screengrab/content/external/log4js.js", screengrab.log4js);
	screengrab.simpledate = {};
	screengrab.ScriptLoader.loadSubScript("chrome://screengrab/content/external/simpledate.js", screengrab.simpledate);
	screengrab.log4js.Log4js.setSimpleDate(screengrab.simpledate);
	
	{
		var loggingEnabled = screengrab.prefs.loggingEnabled();
		var logger = screengrab.log4js.Log4js.getLogger("screengrab");
		logger.setLevel(screengrab.log4js.Log4js.Level.ALL);
		
		var jsConsoleAppender = new screengrab.log4js.MozJSConsoleAppender(logger);
		jsConsoleAppender.setLayout(new screengrab.log4js.MozStackLayout(false));
		
		logger.addAppender(new screengrab.log4js.FirefoxConsoleAppender(logger));
		//logger.addAppender(new screengrab.log4js.FirefoxFileAppender(logger, screengrab.prefs.loggerFileName()));
		logger.addAppender(jsConsoleAppender);
		screengrab.debug = function(msg) {
			if (loggingEnabled) {
				logger.debug(msg);
			}
		}
		screengrab.error = function(msg){
			logger.error(msg);
		}
		screengrab.debug("Logging configured successfully.");
	}
} catch (error) {
	dump("Log configuration failed...\n");
	dump(error + "\n");
}
