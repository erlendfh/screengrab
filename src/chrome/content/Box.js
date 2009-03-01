screengrab.Box = function(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
}
screengrab.Box.prototype = {
    toString : function() {
        return "(" + this.x + "," + this.y + ")[" + this.width + "," + this.height + "]";
    },
    intersects : function(other) {
        var tw = this.width;
        var th = this.height;
        var rw = other.width;
        var rh = other.height;
        if (rw <= 0 || rh <= 0 || tw <= 0 || th <= 0) {
            return false;
        }
        var tx = this.x;
        var ty = this.y;
        var rx = other.x;
        var ry = other.y;
        rw += rx;
        rh += ry;
        tw += tx;
        th += ty;
        return ((rw < rx || rw > tx) && (rh < ry || rh > ty) &&
                   (tw < tx || tw > rx) && (th < ty || th > ry));
    },
    intersection: function(other) {
        var tx1 = this.x;
        var ty1 = this.y;
        var rx1 = other.x;
        var ry1 = other.y;
        var tx2 = tx1; tx2 += this.width;
        var ty2 = ty1; ty2 += this.height;
        var rx2 = rx1; rx2 += other.width;
        var ry2 = ry1; ry2 += other.height;
        if (tx1 < rx1) tx1 = rx1;
        if (ty1 < ry1) ty1 = ry1;
        if (tx2 > rx2) tx2 = rx2;
        if (ty2 > ry2) ty2 = ry2;
        tx2 -= tx1;
        ty2 -= ty1;
        if (tx2 < 0) tx2 = 0;
        if (ty2 < 0) ty2 = 0;
        return new screengrab.Box(tx1, ty1, tx2, ty2);
    },
	copy: function() {
		return new screengrab.Box(this.x, this.y, this.width, this.height);
	},
	contains: function(other) {
		sg.debug(other);
		var leftOk = this.x <= other.x;
		var topOk = this.y <= other.y;
		sg.debug(this.x + this.width);
		sg.debug(other.x + other.width);
		var rightOk = (this.x + this.width) >= (other.x + other.width);
		var bottomOk = this.y + this.height >= other.y + other.height;
		sg.debug(leftOk + "," + topOk + "," + rightOk + "," + bottomOk);
		return leftOk && topOk && rightOk && bottomOk;
	},
	offsetCopy: function(x, y) {
		var copy = this.copy();
		copy.x += x;
		copy.y += y;
		return copy;
	},
	toBoxesSmallerThan: function(width, height) {
		sg.debug("Splitting " + this + " to [" + width + "," + height + "]");
		var copy = this.copy();
		var boxes = this.breakWide(copy, width);
		return this.breakHigh(boxes, height);
	},
	breakWide: function(source, width) {
	    var boxes = new Array();
        while (source.width > width) {
            var smaller = source.copy();
            smaller.width = width;
            source.width -= width;
			source.x += width;
            boxes.push(smaller);
        }
        boxes.push(source);
		return boxes;
	}, 
	breakHigh: function(boxesToSplit, height) {
	    var resultBoxes = new Array();
		boxesToSplit.forEach(function(box) {
	        while (box.height > height) {
	            var smaller = box.copy();
	            smaller.height = height;
	            box.height -= height;
                box.y += height;
	            resultBoxes.push(smaller);
	        }
	        resultBoxes.push(box);
		});
        return resultBoxes;
	}
}
