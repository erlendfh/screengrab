/*
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @fileoverview log4js is a library to log in JavaScript in simmilar manner 
 * than in log4j for Java. The API should be nearly the same.
 * <h3>Example:</h3>
 * <pre>
 *  //logging see log4js
 *  var log = new Log4js.getLogger("some-category-name"); 
 *  log.setLevel(Log4js.Level.TRACE); //set the Level
 *  log.addAppender(new ConsoleAppender(log, false)); // console that launches in new window
 
 *  // if multiple appenders are set all will log
 *  log.addAppender(new ConsoleAppender(log, true)); // console that is inline in the page
 *  log.addAppender(new FileAppender("C:\\somefile.log")); // file appender logs to C:\\somefile.log
 *  ...
 *  //call the log
 *  log.trace("trace me" );
 * </pre>
 *
 * @version 0.2 variant for Firefox extensions
 * Lots of bits culled, and prototype stuff removed - trying to be a good citizen in extension land
 * @author Andrew Mutton - http://www.screengrab.org
 * @author Stephan Strittmatter - http://jroller.com/page/stritti
 * @author Seth Chisamore - http://www.chisamore.com
 */
var Log4js = {
	/**  
	 * map of loggers
	 * @static
	 * @final
	 * @private  
	 */
	loggerMap: new Map(),
	
	/** 
	 * current version of log4js 
	 * @static
	 * @final
	 */
  	version: "0.2",
    
    setSimpleDate : function(simpledate) {
        Log4js.simpledate = simpledate;
    },
    
	/**
	 * Get a logger instance. Instance is cached on categoryName level.
	 * @param  {String} categoryName name of category to log to.
	 * @return {Logger} instance of logger for the category
	 * @static
	 */
	getLogger: function(categoryName) {
		if (!Log4js.loggerMap.contains(categoryName))
		{
	   		Log4js.loggerMap.put(categoryName, new Log4js.Logger(categoryName));
		}
		return Log4js.loggerMap.get(categoryName); 
	},
  	/**
  	 * @param element
  	 * @param name
  	 * @param observer
  	 * @private
  	 */
  	attachEvent: function (element, name, observer) {
		if (element.addEventListener) {
			element.addEventListener(name, observer, false);
    	} else if (element.attachEvent) {
			element.attachEvent('on' + name, observer);
    	}
	}
};




/**
 * Log4js.Level Enumeration. Do not use directly. Use static objects instead.
 * @constructor
 * @param {Number} level
 * @param {String} levelString
 */
Log4js.Level = function(level, levelStr) {
	this.level = level;
	this.levelStr = levelStr;
};

Log4js.Level.prototype =  {
	/** 
	 * converts given String to corresponding Level
	 * @param {String} sArg String value of Level
	 * @param {Log4js.Level} defaultLevel default Level, if no String representation
	 * @return Level object
	 * @type Log4js.Level
	 */
	toLevel: function(sArg, defaultLevel) {                  
				
		if(sArg === null) {
			return defaultLevel;
		}
		
		if(typeof sArg == "string") { 
			var s = sArg.toUpperCase();
			if(s == "ALL") {return Log4js.Level.ALL;}
			if(s == "DEBUG") {return Log4js.Level.DEBUG;}
			if(s == "INFO") {return Log4js.Level.INFO;}
			if(s == "WARN") {return Log4js.Level.WARN;}
			if(s == "ERROR") {return Log4js.Level.ERROR;}
			if(s == "FATAL") {return Log4js.Level.FATAL;}
			if(s == "OFF") {return Log4js.Level.OFF;}
			if(s == "TRACE") {return Log4js.Level.TRACE;}
			return defaultLevel;
		} else if(typeof sArg == "number") {
			switch(sArg) {
				case ALL_INT: return Log4js.Level.ALL;
				case DEBUG_INT: return Log4js.Level.DEBUG;
				case INFO_INT: return Log4js.Level.INFO;
				case WARN_INT: return Log4js.Level.WARN;
				case ERROR_INT: return Log4js.Level.ERROR;
				case FATAL_INT: return Log4js.Level.FATAL;
				case OFF_INT: return Log4js.Level.OFF;
				case TRACE_INT: return Log4js.Level.TRACE;
				default: return defaultLevel;
			}
		} else {
			return defaultLevel;	
		}
	},	
	/** 
	 * @return  converted Level to String
	 * @type String
	 */		
	toString: function() {
		return this.levelStr;	
	},
	/** 
	 * @return internal Number value of Level
	 * @type Number
	 */			
	valueOf: function() {
		return this.level;
	}
};

// Static variables
/** 
 * @private
 */
Log4js.Level.OFF_INT = Number.MAX_VALUE;
/** 
 * @private
 */
Log4js.Level.FATAL_INT = 50000;
/** 
 * @private
 */
Log4js.Level.ERROR_INT = 40000;
/** 
 * @private
 */
Log4js.Level.WARN_INT = 30000;
/** 
 * @private
 */
Log4js.Level.INFO_INT = 20000;
/** 
 * @private
 */
Log4js.Level.DEBUG_INT = 10000;
/** 
 * @private
 */
Log4js.Level.TRACE_INT = 5000;
/** 
 * @private
 */
Log4js.Level.ALL_INT = Number.MIN_VALUE;

/** 
 * Logging Level OFF - all disabled
 * @type Log4js.Level
 * @static
 */
Log4js.Level.OFF = new Log4js.Level(Log4js.Level.OFF_INT, "OFF");
/** 
 * Logging Level Fatal
 * @type Log4js.Level
 * @static
 */
Log4js.Level.FATAL = new Log4js.Level(Log4js.Level.FATAL_INT, "FATAL");
/** 
 * Logging Level Error
 * @type Log4js.Level
 * @static
 */
Log4js.Level.ERROR = new Log4js.Level(Log4js.Level.ERROR_INT, "ERROR"); 
/** 
 * Logging Level Warn
 * @type Log4js.Level
 * @static
 */
Log4js.Level.WARN = new Log4js.Level(Log4js.Level.WARN_INT, "WARN"); 
/** 
 * Logging Level Info
 * @type Log4js.Level
 * @static
 */
Log4js.Level.INFO = new Log4js.Level(Log4js.Level.INFO_INT, "INFO");     
/** 
 * Logging Level Debug
 * @type Log4js.Level
 * @static
 */
Log4js.Level.DEBUG = new Log4js.Level(Log4js.Level.DEBUG_INT, "DEBUG");  
/** 
 * Logging Level Trace
 * @type Log4js.Level
 * @static
 */
Log4js.Level.TRACE = new Log4js.Level(Log4js.Level.TRACE_INT, "TRACE");  
/** 
 * Logging Level All - All traces are enabled
 * @type Log4js.Level
 * @static
 */
Log4js.Level.ALL = new Log4js.Level(Log4js.Level.ALL_INT, "ALL"); 

/**
 * Log4js CustomEvent
 * @constructor
 * @author Corey Johnson - original code in Lumberjack (http://gleepglop.com/javascripts/logger/)
 * @author Seth Chisamore - adapted for Log4js
 * @private
 */
Log4js.CustomEvent = function() {
	this.listeners = [];
};

Log4js.CustomEvent.prototype = {
 
 	/**
 	 * @param method method to be added
 	 */ 
	addListener : function(method) {
		this.listeners.push(method);
	},

 	/**
 	 * @param method method to be removed
 	 */ 
	removeListener : function(method) {
		var foundIndexes = this._findListenerIndexes(method);

		for(var i = 0; i < foundIndexes.length; i++) {
			this.listeners.splice(foundIndexes[i], 1);
		}
	},

 	/**
 	 * @param handler
 	 */ 
	dispatch : function(handler) {
		for(var i = 0; i < this.listeners.length; i++) {
			try {
				this.listeners[i].doAppend(handler);
			}
			catch (e) {
				alert("Could not run the listener " + this.listeners[i] + ". \n" + e);
			}
		}
	},

	/**
	 * @private
	 * @param method
	 */
	_findListenerIndexes : function(method) {
		var indexes = [];
		for(var i = 0; i < this.listeners.length; i++) {			
			if (this.listeners[i] == method) {
				indexes.push(i);
			}
		}

		return indexes;
	}
};

/**
 * Models a logging event.
 * @constructor
 * @param {String} categoryName name of category
 * @param {Log4js.Level} level level of message
 * @param {String} message message to log
 * @param {Log4js.Logger} logger the associated logger
 * @author Seth Chisamore
 */
Log4js.LoggingEvent = function(categoryName, level, message, logger, stackInfo, fullStack) {
	/**
	 * @type Date
	 * @private
	 */
	this.startTime = new Date();
	/**
	 * @type String
	 * @private
	 */
	this.categoryName = categoryName || ".";
	/**
	 * @type String
	 * @private
	 */
	this.message = message || "";
	/**
	 * @type Log4js.Level
	 * @private
	 */
	this.level = level || Log4js.Level.TRACE;
	/**
	 * @type Log4js.Logger
	 * @private
	 */
	this.logger = logger;
	/**
	 * @type String
	 * @private
	 */
	this.stackInfo = stackInfo;
	this.fullStack = fullStack;
};

Log4js.LoggingEvent.prototype = {

	/**
	 * Returns the layouted message line
	 * @return layouted Message
	 * @type String
	 * @deprecated use Layout instead.
	 */
	getRenderedMessage: function() {
		return this.categoryName + "~" + this.startTime.toLocaleString() + " [" + this.level.toString() + "] " + this.message;
	},
	
	getStackFileName : function() {
	    if (this.stackInfo != null) {
	        var split = this.stackInfo.split(" :: ");
	        var fileName = split[1];
	        if (fileName.lastIndexOf("/") != -1) {
	            var pathSplit = fileName.split("/");
	            fileName = pathSplit[pathSplit.length - 1];
	        }
            return fileName
	    }
	    return null;
	},
	
	getStackLineNum : function() {
	    if (this.stackInfo != null) {
	        var split = this.stackInfo.split(" :: ");
	        var lineNum = split[3].split(" ")[1];
	        return lineNum;
	    }
	    return null;
	}
};

/**
 * Logger to log messages to the defined appender.</p>
 * Default appender is Appender, which is ignoring all messages. Please
 * use setAppender() to set a specific appender (e.g. WindowAppender).
 * use {@see Log4js#getLogger(String)} to get an instance.
 * @constructor
 * @param name name of category to log to
 * @author Stephan Strittmatter
 */
Log4js.Logger = function(name) {
	this.loggingEvents = [];
	this.appenders = [];
	/** category of logger */
	this.category = name || "";
	/** level to be logged */
	this.level = Log4js.Level.FATAL;
	
	this.onlog = new Log4js.CustomEvent();
	
	/** appender to write in */
	this.appenders.push(new Appender(this));
};

Log4js.Logger.prototype = {

	/**
	 * add additional appender. DefaultAppender always is there.
	 * @param appender additional wanted appender
	 */
	addAppender: function(appender) {
		this.appenders.push(appender);
	},

	/**
	 * Set the Loglevel default is LogLEvel.TRACE
	 * @param level wanted logging level
	 */
	setLevel: function(level) {
		this.level = level;
	},
	
	getStack: function() {
		if (!Components && !Components.stack) {
			return "";
		}
		var asString = "";
        var stack = Components.stack;
		while (stack != null) {
			var toStr = stack.toString();
			if (toStr.indexOf("log4js.js") == -1 || toStr.indexOf("Log4js.js") == -1) {
				asString += toStr + "\n";
			}
		    stack = stack.caller;
		}
		return asString;
	},
	
	/** main log method logging to all available appenders */
	log: function(message, logLevel) {
	    if (Components && Components.stack) {
	        var stack = Components.stack.caller;
	        while ((stack.toString().indexOf("log4js.js") != -1 || stack.toString().indexOf("Log4js.js") != -1) && stack.caller != null) {
	            stack = stack.caller;
	        }
			var fullStack = null;
			if (logLevel == Log4js.Level.ERROR) {
				fullStack = this.getStack();
			}
	        var loggingEvent = new Log4js.LoggingEvent(this.category, logLevel, message, this, stack.toString(), fullStack);
	    } else {
    		var loggingEvent = new Log4js.LoggingEvent(this.category, logLevel, message, this);
	    }
		this.loggingEvents.push(loggingEvent);
		this.onlog.dispatch(loggingEvent);
	},
	
	/** checks if Level Trace is enabled */
	isTraceEnabled: function() {
		if (this.level.valueOf() <= Log4js.Level.TRACE.valueOf()) {
			return true;
		}
		return false;
	},
	/** logging trace messages */
	trace: function(message) {
		if (this.isTraceEnabled()) {
			this.log(message, Log4js.Level.TRACE);
		}
	},
	/** checks if Level Debug is enabled */
	isDebugEnabled: function() {
		if (this.level.valueOf() <= Log4js.Level.DEBUG.valueOf()) {
			return true;
		}
		return false;
	},
	/** logging debug messages */
	debug: function(message) {
		if (this.isDebugEnabled()) {
			this.log(message, Log4js.Level.DEBUG);
		}
	},
	/** checks if Level Info is enabled */
	isInfoEnabled: function() {
		if (this.level.valueOf() <= Log4js.Level.INFO.valueOf()) {
			return true;
		}
		return false;
	},
	/** logging info messages */
	info: function(message) {
		if (this.isInfoEnabled()) {
			this.log(message, Log4js.Level.INFO);
		}
	},
	/** checks if Level Warn is enabled */
	isWarnEnabled: function() {
		if (this.level.valueOf() <= Log4js.Level.WARN.valueOf()) {
			return true;
		}
		return false;
	},

	/** logging warn messages */
	warn: function(message) {
		if (this.isWarnEnabled()) {
			this.log(message, Log4js.Level.WARN);
		}
	},
	/** checks if Level Error is enabled */
	isErrorEnabled: function() {
		if (this.level.valueOf() <= Log4js.Level.ERROR.valueOf()) {
			return true;
		}
		return false;
	},
	/** logging error messages */
	error: function(message) {
		if (this.isErrorEnabled()) {
			this.log(message, Log4js.Level.ERROR);
		}
	},
	/** checks if Level Fatal is enabled */
	isFatalEnabled: function() {
		if (this.level.valueOf() <= Log4js.Level.FATAL.valueOf()) {
			return true;
		}
		return false;
	},
	/** logging fatal messages */
	fatal: function(message) {
		if (this.isFatalEnabled()) {
			this.log(message, Log4js.Level.FATAL);
		}
	},
	
	/** capture main window errors and log as fatal */
	windowError: function(msg, url, line){
		var message = "Error in (" + (url || window.location) + ") on line "+ line +" with message (" + msg + ")";
		this.log(message, Log4js.Level.FATAL);	
	}
};

/**
 * Interface for Appender.
 * Use this appender as "interface" for other appenders. It is doing nothing.
 *
 * @constructor
 * @param {Log4js.Logger} logger log4js instance this appender is attached to
 * @author Stephan Strittmatter
 */
function Appender(logger) {
	// add listener to the logger methods
	logger.onlog.addListener(this);
	/**
	 * set reference to calling logger
	 * @type Log4js.Logger
	 * @private
	 */
	this.logger = logger;
}

Appender.prototype = {
	/** 
	 * appends the given loggingEvent appender specific
	 * @param {Log4js.LoggingEvent} loggingEvent loggingEvent to append
	 */
	doAppend: function(loggingEvent) {
		return;
	},
	
	/**
	 * Set the Layout for this appender.
	 * @param {Layout} layout Layout for formatting loggingEvent
	 */
	setLayout: function(layout){
		this.layout = layout;
	} 
};

/**
 * Interface for Layouts.
 * Use this Layout as "interface" for other Layouts. It is doing nothing.
 *
 * @constructor
 * @author Stephan Strittmatter
 */
function Layout() {return;}
Layout.prototype = {
	/** 
	 * Implement this method to create your own layout format.
	 * @param {Log4js.LoggingEvent} loggingEvent loggingEvent to format
	 * @return formatted String
	 * @type String
	 */
	format: function(loggingEvent) {
		return "";
	},
	/** 
	 * Returns the content type output by this layout. 
	 * @return The base class returns "text/plain".
	 * @type String
	 */
	getContentType: function() {
		return "text/plain";
	},
	/** 
	 * @return Returns the header for the layout format. The base class returns null.
	 * @type String
	 */
	getHeader: function() {
		return null;
	},
	/** 
	 * @return Returns the footer for the layout format. The base class returns null.
	 * @type String
	 */
	getFooter: function() {
		return null;
	}
};

/**
 * Appender writes the logs to the Shell of Firefox when it is launched with
 * firefox -console (and has the necessary properties enabled)
 * PLEASE NOTE - Only works in Firefox
 * @constructor
 * @extends Appender  
 * @param logger log4js instance this appender is attached to
 * @author Stephan Strittmatter
 */
function FirefoxConsoleAppender(logger) {
	// add listener to the logger methods
	logger.onlog.addListener(this);

	this.logger = logger;
	this.layout = new MozStackLayout(true);

}

FirefoxConsoleAppender.superclass = Appender.prototype;
FirefoxConsoleAppender.prototype = {
	/** 
	 * @see Appender#doAppend
	 */
	doAppend: function(loggingEvent) {
		dump(this.layout.format(loggingEvent));
	},
	/**
	 * @see Appender#setLayout
	 */
	setLayout: function(layout){
		this.layout = layout;
	}
};

/**
 * Appender writes the logs to the JavaScript console of Mozilla browser
 * More infos: http://kb.mozillazine.org/index.php?title=JavaScript_Console&redirect=no
 * PLEASE NOTE - Only works in Mozilla browser
 * @constructor
 * @extends Appender  
 * @param logger log4js instance this appender is attached to
 * @author Stephan Strittmatter
 */
function MozJSConsoleAppender(logger) {
	// add listener to the logger methods
	logger.onlog.addListener(this);

	this.logger = logger;
	this.layout = new SimpleLayout();
	netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
	this.jsConsole = Components.classes["@mozilla.org/consoleservice;1"].getService(Components.interfaces.nsIConsoleService);
	this.scriptError = Components.classes["@mozilla.org/scripterror;1"].createInstance(Components.interfaces.nsIScriptError);
}

MozJSConsoleAppender.superclass = Appender.prototype;
MozJSConsoleAppender.prototype = {
	/** 
	 * @see Appender#doAppend
	 */
	doAppend: function(loggingEvent) {
		netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
		this.scriptError.init(this.layout.format(loggingEvent), null, null, null, null, this.getFlag(loggingEvent), loggingEvent.categoryName);
		this.jsConsole.logMessage(this.scriptError);
	},
	/**
	 * @see Appender#setLayout
	 */
	setLayout: function(layout){
		this.layout = layout;
	},
	/**
	 * map Log4js.Level to jsConsole Flag
	 * @private
	 */	
	getFlag: function(loggingEvent)
	{
		var retval;
		switch (loggingEvent.level) {	
			case Log4js.Level.FATAL:
				retval = 2;//nsIScriptError.exceptionFlag = 2
				break;
			case Log4js.Level.ERROR:
				retval = 0;//nsIScriptError.errorFlag
				break;
			case Log4js.Level.WARN:
				retval = 1;//nsIScriptError.warningFlag = 1
				break;
			default:
				retval = 1;//nsIScriptError.warningFlag = 1
				break;
		}
		//nsIScriptError.strictFlag = 4
		
		return retval;		
	}
};

/**
 * Appender writes the logs to a local file
 * PLEASE NOTE - Only works in Firefox
 * @constructor
 * @extends Appender  
 * @param logger log4js instance this appender is attached to
 * @author Andrew Mutton
 */
function FirefoxFileAppender(logger, filename) {
	// add listener to the logger methods
	logger.onlog.addListener(this);

	this.logger = logger;
	this.filename = filename;
	this.layout = new SimpleLayout();
}

FirefoxFileAppender.superclass = Appender.prototype;
FirefoxFileAppender.prototype = {
	/** 
	 * @see Appender#doAppend
	 */
	doAppend: function(loggingEvent) {
		var data = this.layout.format(loggingEvent);
		try {
			// file is nsIFile, data is a string
			var foStream = Components.classes["@mozilla.org/network/file-output-stream;1"]
			                         .createInstance(Components.interfaces.nsIFileOutputStream);
			var data = this.layout.format(loggingEvent);
			var file = Components.classes["@mozilla.org/file/local;1"]
			                     .createInstance(Components.interfaces.nsILocalFile);
			file.initWithPath(this.filename);
			foStream.init(file, 0x02 | 0x08 | 0x10, 0664, 0);
			foStream.write(data, data.length);
			foStream.close();
		} catch (error) {
			dump(error);
			dump(data);
		}
	},
	/**
	 * @see Appender#setLayout
	 */
	setLayout: function(layout){
		this.layout = layout;
	}
};

/**
 * SimpleLayout consists of the level of the log statement, followed by " - " 
 * and then the log message itself. For example,
 * <code>DEBUG - Hello world</code>
 *
 * @constructor
 * @extends Layout
 * @author Stephan Strittmatter
 */
function SimpleLayout() {
	this.LINE_SEP  = "\n";
	this.LINE_SEP_LEN = 1;
}
SimpleLayout.prototype = {
	/** 
	 * Implement this method to create your own layout format.
	 * @param {Log4js.LoggingEvent} loggingEvent loggingEvent to format
	 * @return formatted String
	 * @type String
	 */
	format: function(loggingEvent) {
		return loggingEvent.level.toString() + " - " + loggingEvent.message + this.LINE_SEP;
	},
	/** 
	 * Returns the content type output by this layout. 
	 * @return The base class returns "text/plain".
	 * @type String
	 */
	getContentType: function() {
		return "text/plain";
	},
	/** 
	 * @return Returns the header for the layout format. The base class returns null.
	 * @type String
	 */
	getHeader: function() {
		return "";
	},
	/** 
	 * @return Returns the footer for the layout format. The base class returns null.
	 * @type String
	 */
	getFooter: function() {
		return "";
	}
};
	
/**
 * BasicLayout is a simple layout for storing the loggs. The loggs are stored
 * in following format:
 * <pre>
 * categoryName~startTime [logLevel] message\n
 * </pre>
 *
 * @constructor
 * @extends Layout
 * @author Stephan Strittmatter
 */
function BasicLayout() {
	this.LINE_SEP  = "\n";
}
BasicLayout.prototype = {
	/** 
	 * Implement this method to create your own layout format.
	 * @param {Log4js.LoggingEvent} loggingEvent loggingEvent to format
	 * @return formatted String
	 * @type String
	 */
	format: function(loggingEvent) {
		return loggingEvent.categoryName + "~" + loggingEvent.startTime.toLocaleString() + " [" + loggingEvent.level.toString() + "] " + loggingEvent.message + this.LINE_SEP;
	},
	/** 
	 * Returns the content type output by this layout. 
	 * @return The base class returns "text/plain".
	 * @type String
	 */
	getContentType: function() {
		return "text/plain";
	},
	/** 
	 * @return Returns the header for the layout format. The base class returns null.
	 * @type String
	 */
	getHeader: function() {
		return "";
	},
	/** 
	 * @return Returns the footer for the layout format. The base class returns null.
	 * @type String
	 */
	getFooter: function() {
		return "";
	}
};

/**
 * MozStackLayout is a layout that takes advantage of stack data from Mozilla. 
 * <pre>
 * fileName:lineNum ~ startTime [logLevel] message\n
 * </pre>
 *
 * @constructor
 * @extends Layout
 * @author Stephan Strittmatter
 */
function MozStackLayout(showDate) {
	this.LINE_SEP  = "\n";
	this.showDate = showDate;
}
MozStackLayout.prototype = {
	/** 
	 * Implement this method to create your own layout format.
	 * @param {Log4js.LoggingEvent} loggingEvent loggingEvent to format
	 * @return formatted String
	 * @type String
	 */
	format: function(loggingEvent) {
		var formatted = loggingEvent.level.toString() + " [" + loggingEvent.categoryName + "|" + loggingEvent.getStackFileName() + ":" + loggingEvent.getStackLineNum() + "] " + loggingEvent.message + this.LINE_SEP;
	    if (this.showDate && Log4js.simpledate) {
    	    var d = new Log4js.simpledate.SimpleDate(loggingEvent.startTime.getTime());
          	formatted = d.toFormattedString("~d/~k/~y ~H:~m:~s:~S") + " " + formatted;
	    }
		if (this.fullStack != null) {
			formatted += this.fullStack + this.LINE_SEP;
		}
		return formatted;
	},
	
	/** 
	 * Returns the content type output by this layout. 
	 * @return The base class returns "text/plain".
	 * @type String
	 */
	getContentType: function() {
		return "text/plain";
	},
	/** 
	 * @return Returns the header for the layout format. The base class returns null.
	 * @type String
	 */
	getHeader: function() {
		return "";
	},
	/** 
	 * @return Returns the footer for the layout format. The base class returns null.
	 * @type String
	 */
	getFooter: function() {
		return "";
	}
};

/**
 * HtmlLayout write the logs in Html format.
 *
 * @constructor
 * @extends Layout
 * @author Stephan Strittmatter
 */
function HtmlLayout() {return;}
HtmlLayout.prototype = {
	/** 
	 * Implement this method to create your own layout format.
	 * @param {Log4js.LoggingEvent} loggingEvent loggingEvent to format
	 * @return formatted String
	 * @type String
	 */
	format: function(loggingEvent) {
		return "<div style=\"" + this.getStyle(loggingEvent) + "\">" +loggingEvent.level.toString() + " - " + loggingEvent.message + "</div>\n";
	},
	/** 
	 * Returns the content type output by this layout. 
	 * @return The base class returns "text/html".
	 * @type String
	 */
	getContentType: function() {
		return "text/html";
	},
	/** 
	 * @return Returns the header for the layout format. The base class returns null.
	 * @type String
	 */
	getHeader: function() {
		return "<html><head><title>log4js</head><body>";
	},
	/** 
	 * @return Returns the footer for the layout format. The base class returns null.
	 * @type String
	 */
	getFooter: function() {
		return "</body></html>";
	},
	
	getStyle: function(loggingEvent)
	{
		var style;
		if (loggingEvent.level.toString().search(/ERROR/) != -1) { 
			style = 'color:red';
		} else if (loggingEvent.level.toString().search(/FATAL/) != -1) { 
			style = 'color:red';
		} else if (loggingEvent.level.toString().search(/WARN/) != -1) { 
			style = 'color:orange';
		} else if (loggingEvent.level.toString().search(/DEBUG/) != -1) {
			style = 'color:green';
		} else if (loggingEvent.level.toString().search(/INFO/) != -1) {
			style = 'color:white';
		} else {
			style = 'color:yellow';
		}	
		return style;
	}
};

/**
 * XMLLayout write the logs in XML format.
 * Layout is simmilar to log4j's XMLLayout:
 * <pre>
 * <log4js:event category="category" level="Level" client="Client" referer="ref" timestam="Date">
 * <log4js:message>Logged message</log4js:message>
 * </log4js:event>
 * </pre>
 * @constructor
 * @extends Layout
 * @author Stephan Strittmatter
 */
function XMLLayout() {return;}
XMLLayout.prototype = {
	/** 
	 * Implement this method to create your own layout format.
	 * @param {Log4js.LoggingEvent} loggingEvent loggingEvent to format
	 * @return formatted String
	 * @type String
	 */
	format: function(loggingEvent) {
		var content = "<log4js:event logger=\"";
		content += loggingEvent.categoryName + "\" level=\"";
		content += loggingEvent.level.toString() + "\" client=\"";
		content += navigator.userAgent + "\" referer=\"";
		content += location.href + "\" timestamp=\"";
		content += loggingEvent.startTime + "\">\n";
		content += "<log4js:message><![CDATA[" + loggingEvent.message + "]]></log4js:message>\n";	
 		content += "</log4js:event>\n";
        
      return content;
	},
	/** 
	 * Returns the content type output by this layout. 
	 * @return The base class returns "text/xml".
	 * @type String
	 */
	getContentType: function() {
		return "text/xml";
	},
	/** 
	 * @return Returns the header for the layout format. The base class returns null.
	 * @type String
	 */
	getHeader: function() {
		return "<log4js:eventSet version=\"" + Log4js.version + 
			"\" xmlns:log4js=\"http://log4js.berlios.de/log4js/\">\n";
	},
	/** 
	 * @return Returns the footer for the layout format. The base class returns null.
	 * @type String
	 */
	getFooter: function() {
		return "</log4js:eventSet>\n";
	}
};

/**
 * JSONLayout write the logs in JSON format.
 * JSON library is required to use this Layout. See also {@link http://www.json.org}
 * @constructor
 * @extends Layout
 * @author Stephan Strittmatter
 */
function JSONLayout() {return;}
JSONLayout.prototype = {
	/** 
	 * Implement this method to create your own layout format.
	 * @param {Log4js.LoggingEvent} loggingEvent loggingEvent to format
	 * @return formatted String
	 * @type String
	 */
	format: function(loggingEvent) {        
        return JSON.stringify(loggingEvent);
	},
	/** 
	 * Returns the content type output by this layout. 
	 * @return The base class returns "text/xml".
	 * @type String
	 */
	getContentType: function() {
		return "text/json";
	},
	/** 
	 * @return Returns the header for the layout format. The base class returns null.
	 * @type String
	 */
	getHeader: function() {
		return "";
	},
	/** 
	 * @return Returns the footer for the layout format. The base class returns null.
	 * @type String
	 */
	getFooter: function() {
		return "";
	}
};

 /**
  * Implementtion of java.util.HashMap
  * @private 
  */
function Map(){
    var keys = new Array();
    this.contains = function(key){
       var entry = findEntry(key);
       return !(entry == null || entry instanceof NullKey);
    }
    this.get = function(key) {
     var entry = findEntry(key);
     if ( !(entry == null || entry instanceof NullKey) )
        return entry.value;
      else
        return null;
    };
    this.put = function(key, value) {
      var entry = findEntry(key);
      if (entry){
        entry.value = value;
      } else {
        addNewEntry(key, value);
      }
    };
    this.remove = function (key){
      for (var i=0;i<keys.length;i++){
        var entry = keys[i];
        if (entry instanceof NullKey) continue;
        if (entry.key == key){
            keys[i] = NullKey;
        }
      }        
    };
    this.size = function() {
    	return keys.length;
    };
    function findEntry(key){
      for (var i=0;i<keys.length;i++){
        var entry = keys[i];
        if (entry instanceof NullKey) continue;
        if (entry.key == key){
            return entry
        }
      }
      return null;
    };
    function addNewEntry(key, value){
        var entry = new Object();
        entry.key = key;
        entry.value = value;
        keys[keys.length] = entry; 
    }
  }
/**
 * replace the entries of map in key array, removing the former value
 * @private
 */
function NullKey(){
}
new NullKey();

/**
 * ArrayList like java.util.ArrayList
 * @private
 */
function ArrayList()
{
  this.array = new Array();
};

ArrayList.prototype = {

	add: function(obj){
		this.array[this.array.length] = obj;
	},

	iterator: function (){
		return new Iterator(this);
		},
  
	length: function (){
		return this.array.length;
	},
  
	get: function (index){
		return this.array[index];
	},
  
	addAll: function (obj)
	{
		if (obj instanceof Array) {
			for (var i=0;i<obj.length;i++) {
				this.add(obj[i]);
			}
		} else if (obj instanceof ArrayList) {
			for (var j=0;j<obj.length();i++) {
				this.add(obj.get(j));
			}
		}
	}
};

/**
 * Iterator for ArrayList
 * @private
 */
function Iterator (arrayList){
	this.arrayList = arrayList;
	this.index = 0;
};
Iterator.prototype = {
	hasNext: function (){
		return this.index < this.arrayList.length();
	},
	next: function() {
		return this.arrayList.get( index++ );
	}
}
