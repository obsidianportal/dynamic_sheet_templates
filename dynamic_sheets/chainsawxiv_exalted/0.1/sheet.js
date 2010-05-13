
// Temporary demo functionality
if (location.href.match(/edit/)) bEditMode = true;
else bEditMode = false;

// Globals
bSubmitTimeout = false;

///////////////////////////////////////////////////
// Event Hooks /////////////////////////////////////
///////////////////////////////////////////////////

// Called immediately before the script fills the Span fields with data
function hook_dataPreLoad(){
	listConvert();
}

// Called immediately after the script fills the Span fields with data, before JediTable attachement
function hook_dataPostLoad(){
	pipsConvert();
	areaActivate();
	listHide();
}

// Called immediately after the JediTable events are attached
function hook_dataPostBind(){

}

///////////////////////////////////////////////////
// Pips Interface Control /////////////////////////////
///////////////////////////////////////////////////

// Converts the contents of span tags with class "pips" to pips interfaces
function pipsConvert(oScope){

	// Get allt he span tags in the scope, or on the page
	var aSpans = new Array();
	if (oScope) aSpans = oScope.getElementsByTagName('span');
	else aSpans = document.getElementsByTagName('span');
	
	// Identify pips spans from their clas, including the range of the element
	var iValue = 0;
	var iRange = 0;
	for (var i = 0; i < aSpans.length; i++){
		if (aSpans[i].className.match(/pips/)){
			if (aSpans[i].className.match(/pips3/)) iRange = "03";
			else if (aSpans[i].className.match(/pips5/)) iRange = "05";
			else if (aSpans[i].className.match(/pips7/)) iRange = "07";
			else if (aSpans[i].className.match(/pips10/)) iRange = "10";
			iValue = padDigits(aSpans[i].innerHTML,2);
			
			// Replace the number with the appropriate pips image
			aSpans[i].innerHTML = '<img src="dynamic_sheets/chainsawxiv_exalted/0.1/images/pips-' + iValue + '-' + iRange + '.png" class="pips pips' + iRange + '" />';
		}
	}
	
	// If this is an edit page, then activate the pips
	if(bEditMode) pipsActivate();

}

// Function which assigns clickability to pips images
function pipsActivate(){

	// Don't run any of this if we're not in edit mode
	if (!bEditMode) return;

	// Gather up all the images within the sheet div
	var aImages = document.getElementById("ds_chainsawxiv_exalted").getElementsByTagName("img");
	for (var i = 0; i < aImages.length; i++){

		// If an image has "pips" in its CSS classes, assign the event handler to it
		if (aImages[i].className.match(/pips/)){
			aImages[i].onclick = pipsClick;
		}
	}
}
	
// onClick function for pips value input and display
function pipsClick(e){

	// Provide cross-browser support for the event information
	var oEvent;
	if (window.event) oEvent = window.event;
	else oEvent = e;

	// Get the pips image that was clicked
	var oImage = this;

	// Parse out the current score and max score from the file name
	var iRange = parseInt(oImage.src.substring(oImage.src.length - 6,oImage.src.length - 4),10);
	var iCurrentScore = parseInt(oImage.src.substring(oImage.src.length - 9,oImage.src.length - 7),10);
	
	// Define the click areas for each pip by hand, to allow for spacing and grouping
	var aThresholds = [0,21,38,55,72,92,113,130,147,164];

	// Determine which pip the click was on and change the image
	var iClickX = oEvent.clientX - findPos(oImage);
	for (var iScore = iRange; iScore >= 0; iScore--){
		if (iClickX > aThresholds[iScore]){

			// If the user clicks the current score, they probably want to reduce by one
			if ((iScore + 1) == iCurrentScore){
				oImage.src = oImage.src.substring(0,oImage.src.length - 9) + padDigits(iScore,2) + "-" + padDigits(iRange,2) + ".png";
				pipsSave(oImage.parentNode.id.substring(3),iScore);				
			}
			else{
				oImage.src = oImage.src.substring(0,oImage.src.length - 9) + padDigits(iScore + 1,2) + "-" + padDigits(iRange,2) + ".png";
				pipsSave(oImage.parentNode.id.substring(3),iScore+1);
			}

			// Save the value and stop
			return;
			
		}
	}
}

// Function that saves the value out of the input element
function pipsSave(sParameterName,sValue){

	// May need to generate hidden dummy elements in the HTML instead
	dynamic_sheet_attrs[sParameterName] = sValue;

}

///////////////////////////////////////////////////
// List Interface Control /////////////////////////////
///////////////////////////////////////////////////

// Converts divs with the "list" class into dynamic lists
function listConvert(){

	// Find all the divs on the page with "list" in their class name
	var aDivs = document.getElementsByTagName('div');
	for (var i = 0; i < aDivs.length; i++){
		if (aDivs[i].className.match(/list_/)) listBuild(aDivs[i]);
	}	
	
}

// Hides the interface buttons if not in edit mode
function listHide(){
	
	// Don't run this if we're in edit mode
	if (bEditMode) return;
	
	// Run through all links and hide any of them with "button" in their class name
	var aButtons = document.getElementsByTagName('a');
	for (var i = 0; i < aButtons.length; i++){
		if (aButtons[i].className.match(/button/)){
			aButtons[i].style.display = 'none';
		}
	}	
}

// Gets all the keys from the main var associated with the list
function listKeys(sPattern){

	var aKeys = new Array();
	var iCounter = 0;
	for (sKey in dynamic_sheet_attrs){
		if (sKey.match(RegExp(sPattern))){
			aKeys[iCounter] = sKey;
			iCounter++;
		}
	}
	return aKeys;
	
}

// Populates a list based on the id and class name
function listBuild(oList){

	// Get the template to use and the fields in it
	var oTemplate = document.getElementById(oList.className.match(/list_[\w_]+/).toString().substring(5));
	var aFields = oTemplate.getElementsByTagName('span');

	// Get arrays of the variable keys for each field
	var aKeys = new Array();
	for (var i = 0; i < aFields.length; i++){
		aKeys[i] = listKeys(aFields[i].id.substring(3));
	}
	
	// Set up column breaks if needed
	var iBreak = 0;
	if (oList.className.match(/list3/)){
		iBreak = Math.ceil(aKeys[0].length/3);
	}
	
	// Build the list code
	var sTemp = '';
	for (var n = 0; n < aKeys[0].length; n++){

		// Add column openers and closers if needed
		if (iBreak){
			if (n == 0) sTemp += '\n<div class="column column_spacing">';
			else if (n == iBreak) sTemp += '</div>\n<div class="column column_spacing">';
			else if (n == (iBreak * 2)) sTemp += '</div>\n<div class="column">';
			else if (n == (aKeys[0].length)) sTemp += '</div>';
		}
				
		// Populate and id the fields
		for (var x = 0; x < aFields.length; x++){
			aFields[x].id = "ds_" + aKeys[x][n];
			aFields[x].innerHTML = dynamic_sheet_attrs[aKeys[x][n]];
		}
		
		// Add the list item to the code
		sTemp += oTemplate.innerHTML;
		
	}
	
	// Put the code in the list
	oList.innerHTML = sTemp;
	
	// Reset the template if it was used
	if (aKeys[0].length){
		var aFields = oTemplate.getElementsByTagName('span');
		for (var i = 0; i < aFields.length; i++){
			aFields[i].id = aFields[i].id.substring(0,aFields[i].id.length - 2);
		}
	}
}

// Deletes an item from a list
function listDelete(oButton){

	// Get the list
	var oList = oButton.parentNode.parentNode;
	if (!oList.className.match(/list/)) oList = oButton.parentNode.parentNode.parentNode;

	// Get the target row
	var oRow = oButton.parentNode;
	var aFields = oRow.getElementsByTagName('span');
	
	// Kill the variable associated with each field
	for (var i = 0; i < aFields.length; i++){
		delete dynamic_sheet_attrs[aFields[i].id.substring(3)];
	}
	
	// Repopulate the list
	listBuild(oList);
	
	// Convert piips
	pipsConvert(oList);
	
	// Activate edit features
	dst_devkit.bindDynamicAttributes();
	
}

// Adds an item to a list
function listAdd(sListId,sTemplateId){

	// Collect the basics
	var oList = document.getElementById(sListId);
	var oTemplate = document.getElementById(sTemplateId);
	var aFields = oTemplate.getElementsByTagName('span');
	
	// Find the lowest unused index
	var iIndex = 0;
	while(dynamic_sheet_attrs[aFields[0].id.substring(3) + padDigits(iIndex,2)] != undefined) iIndex++;
	
	// Write blank values to the fields
	for (var i = 0; i < aFields.length; i++){
		dynamic_sheet_attrs[aFields[i].id.substring(3) + padDigits(iIndex,2)] = '';
	}
	
	// Repopulate the list
	listBuild(oList);
	
	// Convert piips
	pipsConvert(oList);
	
	// Activate edit features
	dst_devkit.bindDynamicAttributes();
	
}

///////////////////////////////////////////////////
// Text Area Edit Control ////////////////////////////
///////////////////////////////////////////////////

// Attaches edit events to area text
function areaActivate(){

	// Don't run any of this if we're not in edit mode
	if (!bEditMode) return;

	// Gather up all the spans within the sheet div
	var aImages = document.getElementById("ds_chainsawxiv_exalted").getElementsByTagName("span");
	for (var i = 0; i < aImages.length; i++){

		// If an image has "pips" in its CSS classes, assign the event handler to it
		if (aImages[i].className.match(/area/)){
			aImages[i].onclick = areaClick;
		}
	}
	
}

// onClick function for area value input and display
function areaClick(e){

	// Stop right here if the submit button was just clicked
	if(bSubmitTimeout){
		bSubmitTimeout = false;
		return;
	}

	var oSpan = this;
	var iWidth = oSpan.offsetWidth;
	var iHeight = oSpan.offsetHeight;

	// Disable click functionality
	oSpan.onclick = '';
	
	// Convert content into form with button
	oSpan.innerHTML = '<textarea style="width:' + (iWidth - 23) + 'px;height:' + (iHeight - 6) + 'px;">' + oSpan.innerHTML + '</textarea>';
	oSpan.innerHTML += '<button class="submit_button area_submit" onClick="areaSubmit(this);"><div class="submit_text">&#10003;</div></button>';

}

// Submit button function for area inputs
function areaSubmit(oButton){

	var oSpan = oButton.parentNode;
	var sContent = oSpan.getElementsByTagName('textarea')[0].value;
	
	// Remove the form elements
	oSpan.innerHTML = sContent;
	
	// Reattach the click functionality
	bSubmitTimeout = true;
	oSpan.onclick = areaClick;
	
	// Save the value to the variable
	dynamic_sheet_attrs[oSpan.id.substring(3)] = sContent;	

}

///////////////////////////////////////////////////
// General Utility Functoins //////////////////////////
///////////////////////////////////////////////////

// Converts a number to a string with prepended zeros to the specified character length
function padDigits(iNumber,iDigits){
	var sNumber = iNumber.toString();
	var sTemp = '';
	if (iDigits > sNumber.length){
		for (var i = 0; i < (iDigits - sNumber.length); i++){
			sTemp += '0';
		}
	}
	return sTemp + sNumber;
} 

// Finds the X position of an object on the page
function findPos(oObject) {
	
	// Walk up the offset parent tree to get the true coords
	var iX = oObject.offsetLeft;
	if (oObject.offsetParent){
		while (oObject = oObject.offsetParent){
			iX += oObject.offsetLeft;
		} 
		return iX;
	}
	
}

