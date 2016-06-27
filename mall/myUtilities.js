/**
 * Useful tools and utilities
 * Written by: Mattis Andersson
 */
 
 /**
  * Generates an integer between the two intervals, uses 0 a default intervalMin if not specified and max as intervalMin+1
  */
 function randomInteger2(intervalMax, intervalMin){
	var tempNumber = Math.random();
	
	intervalMin = intervalMin || 0; // if intervalMin is undefined or similar it will be set to 0
	intervalMax = intervalMax || intervalMin+1;
	
	var interval = (intervalMax+1 - intervalMin);
	tempNumber = Math.floor(tempNumber * interval);
	tempNumber += intervalMin;
	
	return tempNumber;
 }
 
 /**
  * Generates a float between the two intervals, uses 0 a default intervalMin if not specified and max as 1, numberOfDecimals are the number of decimals
  * to be used(standard 3 if not specified)
  */
 function randomFloat(intervalMax, intervalMin, numberOfDecimals){
	intervalMin = intervalMin || 0; // if intervalMin is undefined or similar it will be set to 0
	intervalMax = intervalMax || intervalMin+1;
	numberOfDecimals = numberOfDecimals || 3;
	
	
	var tempNumber = Math.random();
	
	var interval = (intervalMax+1 - intervalMin);
	tempNumber = (tempNumber * interval);
	tempNumber += intervalMin;
	tempNumber = parseFloat(tempNumber.toFixed(numberOfDecimals)); // must use parseFloat because toFixed returns a string
	
	return tempNumber;
 }
 
 
 /**
  * Returns the css that causes the element "img" to be centered within the element called "divCenter"
  */
function centerImage(img, divCenter){
	var divW = divCenter.width(), divH = divCenter.height(), newTop, newLeft;
	console.log("inside centerImage with img: " + img + " and divW " + divW + " and divH " + divH);
	newTop = (divH/2)-(img.height()/2);
	newLeft = (divW/2)-(img.width()/2);
	
	return {"position":"relative", "top":newTop+"px", "left":newLeft+"px"};
}