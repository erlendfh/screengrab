/*
Copyright (C) 2004-2007  Andy Mutton

This program is free software; you can redistribute it and/or
modify it under the terms of the GNU General Public License
as published by the Free Software Foundation; either version 2
of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program; if not, write to the Free Software
Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.

Contact: andy@5263.org
*/
var BACKGROUND_DIV = "screengrabBackgroundDiv";
var DRAW_DIV = "screengrabDrawDiv";
var BOX_DIV = "screengrabBoxDiv";

var originX = null;
var originY = null;

function beginBoxDraw(event) {
	var winCon = window._content;
    var boxDiv = winCon.document.getElementById(BOX_DIV);
    if (boxDiv == null) {
        boxDiv = winCon.document.createElement("div");
        boxDiv.setAttribute("id", BOX_DIV);
        boxDiv.setAttribute("class", "boxOverlay");
	    winCon.document.getElementById(BACKGROUND_DIV).appendChild(boxDiv);
    }
    
    boxDiv.style.display = "none";
    boxDiv.style.left = event.clientX + "px";
    boxDiv.style.top = event.clientY + "px";
    boxDiv.setAttribute("onmousedown", "clearBox(event)");
    winCon.document.addEventListener("mousemove", boxDrawing, true);
    winCon.document.addEventListener("mouseup", endBoxDraw, true);
    originX = event.clientX;
    originY = event.clientY;
}

function boxDrawing(event) {
	var winCon = window._content;
    var boxDiv = winCon.document.getElementById(BOX_DIV);

    var mouseX = event.clientX;
    var mouseY = event.clientY;
    
    var left = mouseX < originX ? mouseX : originX;
    var top = mouseY < originY ? mouseY : originY;

    var width = Math.abs(mouseX - originX);
    var height = Math.abs(mouseY - originY);

    boxDiv.style.display = "none";
    boxDiv.style.left = left + "px";
    boxDiv.style.top = top + "px";

    boxDiv.style.width = width + "px";
    boxDiv.style.height = height + "px";
    
    boxDiv.style.display = "inline";
}

function endBoxDraw(event) {
	var winCon = window._content;
    winCon.document.removeEventListener("mousemove", boxDrawing, true);
    winCon.document.removeEventListener("mouseup", endBoxDraw, true);
}
