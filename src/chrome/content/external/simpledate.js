 /****************************************************************************
* Object: SimpleDate
* Description: Date Object which allow string format in many formats
* Author: Uzi Refaeli
* From: http://www.comet.co.il/en/articles/date/article.html
*****************************************************************************/


//======================================== Properties============================================
/**
 * private - access by the methods
 */
SimpleDate.prototype.dateValue = null; // private
SimpleDate.prototype.monthArray = new Array("January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December");//private
SimpleDate.prototype.dayArray = new Array("Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday");//private
//======================================== Costructor ===========================================

/**
 * Construct new SimpleDate object and initiate it.
 * If date param is null the current date is set.
 * If date param is a Date object the we just assign it.
 * Than a long value is tested in decimal radix (be aware to parseInt limitation).
 * param: data - date value (see above).
 */
function SimpleDate(date){
	if (date == null){
		this.dateValue = new Date();
	}else if (date instanceof Date){
        this.dateValue = date;
    }else  if (date instanceof Number){
        this.dateValue = new Date(date);
    }else {
		var longValue = parseInt(date, 10);
        this.dateValue = new Date(longValue);
	}
}

//======================================== Public Methods ======================================
/**
 * Construct new object with the same value as this.
 * return: SimpleDate.
 */
SimpleDate.prototype.clone = function (){
	return new SimpleDate(this.getLongValue());
}

/**
 * Returns cuurnet date in long format - UTC time
 * param: bool - Boolean, to leave the seconds or not.
 */
SimpleDate.prototype.getLongValue = function (leaveSecondes){
	var tDate = new Date(this.valueOf());

	//do we need to lose the seconds and milli...
	if (!leaveSecondes)
		tDate.setUTCSeconds(0, 0);

	return tDate.valueOf();
}

/**
 * set new long date
 * param: longValue - New long value
 */
SimpleDate.prototype.setLongValue = function (longValue){
	this.dateValue = new Date(longValue);
}

//-------------
/**
 * Return the date object value
 */
SimpleDate.prototype.valueOf = function (date){
	return this.dateValue.valueOf();
}

//-------------
/**
 * set new date
 * param: date - Date object or long value
 */
SimpleDate.prototype.setDate = function (date){
	if (date instanceof Date)
		this.dateValue = date;
	else
		this.dateValue = new Date(date);
}

//-------------
/**
 * Change the hour field
 * param: hour - Numeric hour
 */
SimpleDate.prototype.setHours = function (hour){
	this.dateValue.setUTCHours(hour);
}

/**
 * return: the hour field
 */
SimpleDate.prototype.getHours = function (){
	return this.dateValue.getUTCHours();
}

/**
 * Change the minutes field
 * param: minutes - Numeric minutes
 */
SimpleDate.prototype.setMinutes = function (minutes){
	this.dateValue.setUTCMinutes(minutes);
}

/**
 * return: the minute field
 */
SimpleDate.prototype.getMinutes = function (){
	return this.dateValue.getUTCMinutes();
}


/**
 * Change the minutes field
 * param: seconds - Numeric seconds
 * param: milliseconds - Optional, Numeric milliseconds
 */
SimpleDate.prototype.setSeconds = function (seconds, milliseconds){
	if (milliseconds)
		this.dateValue.setUTCSeconds(seconds, milliseconds);
	else
		this.dateValue.setUTCSeconds(seconds, 0);
}

/**
 * return: the second field
 */
SimpleDate.prototype.getSeconds = function (){
	return this.dateValue.getUTCSeconds();
}

/**
 * Sets the numeric date in the Date object using Universal Coordinated Time (UTC).
 * param: Required. A numeric value equal to the numeric date.
 * return: Nothing
 */
SimpleDate.prototype.setDayInMonth = function (numDate){
	this.dateValue.setUTCDate(numDate);
}

/**
 * return: Day of year (0-6)
 */
SimpleDate.prototype.getDayOfWeek = function (){
	return this.dateValue.getUTCDay();
}

/**
 * return: Day in month (1-31)
 */
SimpleDate.prototype.getDayInMonth = function (){
	return this.dateValue.getUTCDate();
}

/**
 * Sets the year value in the Date object using Universal Coordinated Time (UTC).
 * param: Required. A numeric value equal to the year.
 * return: Nothing
 */
SimpleDate.prototype.setYear = function (numYear){
	this.dateValue.setUTCFullYear(numYear);
}

/**
 * return: Year
 */
SimpleDate.prototype.getYear = function (){
	return this.dateValue.getUTCFullYear();
}

/**
 * Sets the month value in the Date object using Universal Coordinated Time (UTC).
 * param: Required. A numeric value equal to the month.
 * return: Nothing
 */
SimpleDate.prototype.setMonth = function (month){
	this.dateValue.setUTCMonth(month);
}

/**
 * return: Month
 */
SimpleDate.prototype.getMonth = function (){
	return this.dateValue.getUTCMonth();
}

//-------------
/**
 * Return the date long value as String
 */
SimpleDate.prototype.toString = function (){
	return this.getLongValue()+"";
}

//-------------
/**
 * Returns date in a formated string.
 * param: stringFormat - The requested format.
 * 		The stringFormat parameter is being read char after char.
 *		Each one of the speical chars (see below) is replaced by it's equivalent value.
 *		Any other chars are copied to the new string without a change.
 *
 *		toFormatedString special chars and their meaning:
 *		-------------------------------------------------
 *
 *		|-------|-------------------------------|---------------|
 *		| Char  |          Description          |   Example     |
 *		|-------|-------------------------------|---------------|
 *		|   ~y  | Year - two digits             | 04            |
 *		|-------|-------------------------------|---------------|
 *		|   ~Y  | Year - four digits            | 2004          |
 *		|-------|-------------------------------|---------------|
 *		|   ~d  | Day in month                  | 01 - 31       |
 *		|-------|-------------------------------|---------------|
 *		|   ~D  | Day in month (Full string)    | Sunday        |
 *		|-------|-------------------------------|---------------|
 *		|   ~w  | Day in week                   | 0 - 6         |
 *		|-------|-------------------------------|---------------|
 *		|   ~W  | Day in week                   | 1 - 7         |
 *		|-------|-------------------------------|---------------|
 *		|   ~k  | Month in year                 | 1 - 12        |
 *		|-------|-------------------------------|---------------|
 *		|   ~M  | Month in year (Full string)   | April         |
 *		|-------|-------------------------------|---------------|
 *		|   ~a  | AM/PM marker			        | AM, PM        |
 *		|-------|-------------------------------|---------------|
 *		|   ~h  | Hour (12 hours)   	        | 02            |
 *		|-------|-------------------------------|---------------|
 *		|   ~H  | Hour (24 hours)   	        | 14            |
 *		|-------|-------------------------------|---------------|
 *		|   ~m  | Minutes		 	  	        | 69 :-)        |
 *		|-------|-------------------------------|---------------|
 *		|   ~s  | Seconds		 	  	        | 69 :-)        |
 *		|-------|-------------------------------|---------------|
 *		|   ~S  | Milliseconds	 	  	        | 451           |
 *		|-------|-------------------------------|---------------|
 *		|   ~L  | Long value	 	  	        | 1076502654847 |
 *		|-------|-------------------------------|---------------|
 *		* Please note that In future more letters may be used so
 *		  consider all a-z && A-Z as reserved letters.
 */

 SimpleDate.prototype.toFormattedString = function (stringFormat){
	if (this.dateValue == null)
		return "";
	var buffer = new Array();
	try{
		for (var i = 0; i < stringFormat.length; i++){
			var chr1 = stringFormat.charAt(i);
			if(chr1 == "~"){
				buffer[buffer.length] = this.getNextToken(stringFormat.charAt(++i), this.dateValue);
			}else{
				buffer[buffer.length] = chr1;
			}
		}
	}catch(e){
		return null;
	}

	return buffer.join("");
}

//======================================== Private Methods ======================================
SimpleDate.prototype.getNextToken = function (chr, date){
	var ret = chr;
	switch (chr){
		case "y":
			//year tow digits (04)
			ret = new String(date.getUTCFullYear()).substr(2);
			break;
		case "Y":
			//year four digits (2004)
			ret = date.getUTCFullYear();
			break;
		case "d":
			//day in month (1 - 31)
			ret = date.getUTCDate();
			ret = ret < 10 ? "0" + ret : ret;
			break;
		case "D":
			//day in week (Full String)
			ret = this.dayArray[date.getUTCDay()];
			break;
		case "w":
			//day of week (0-6)
			ret = date.getUTCDay();
			break;
		case "W":
			//day of week (1-7)
			ret = date.getUTCDay() + 1;
			break;
		case "k":
			//month of year (1-12)
			ret = date.getUTCMonth() + 1;
			ret = ret < 10 ? "0" + ret : ret;
			break;
		case "M":
			//month of year (full string)
			ret = this.monthArray[date.getUTCMonth()];
			break;
		case "a":
			//am/pm marker
			ret = date.getUTCHours() < 12 ? "AM" : "PM";
			break;
		case "h":
			//hour (12 hours)
			ret = date.getUTCHours();
			ret = ret > 12 ? ret - 12 : ret;
			ret = ret < 10 ? "0" + ret : ret;
			break;
		case "H":
			//hour (24 hours)
			ret = date.getUTCHours();
			ret = ret < 10 ? "0" + ret : ret;
			break;
		case "m":
			//minutes
			ret = date.getUTCMinutes();
			ret = ret < 10 ? "0" + ret : ret;
			break;
		case "s":
			//secondes
			ret = date.getUTCSeconds();
			ret = ret < 10 ? "0" + ret : ret;
			break;
		case "S":
			//milisecondes
			ret = date.getUTCMilliseconds();
			break;
		case "L":
			//long value
			ret = date.valueOf();
			break;
	}
	return ret;
}

