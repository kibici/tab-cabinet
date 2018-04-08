var boxes;
var boxesChecked;
var savedGroups = [];
var numSaves;
var cleared;
var mainFolderId;

var selectedOpen;
var confirmOpen;

var toReplaceID;
var toRaplaceName; 


/////////////////////////////////////////////////////////////////////////

//Alternative to in-line script: Set onclick properties

document.addEventListener('DOMContentLoaded', loaded);

function loaded() {
	
}

function tabClicked() {

	if (this.firstChild.checked === true) {
		this.firstChild.checked = false;
	}

	else {
		this.firstChild.checked = true;
	}
}

function boxClicked() {
}
	
function shorten(text, maxLength) {
	var ret = text;
	if (ret.length > maxLength) {
		ret = ret.substr(0,maxLength-4) + '...';
	}
	return ret;
}


//////////////////////////////////////////////////////////

// Get tabs in current window

chrome.tabs.query({currentWindow: true}, function(tabs){
	boxes = tabs.length;
	boxesChecked = tabs.length;

	
	var boxList = document.getElementById("tabs");

	// document.getElementById("here").innerHTML = tabs.length +" of "+tabs.length+" tabs selected";
	
	for(i = 0 ; i < tabs.length ; i++){
		var cbox = document.createElement('input');
		cbox.setAttribute("type","checkbox");
		cbox.setAttribute("checked","checked");
		cbox.setAttribute("value","selected");
		cbox.setAttribute("id",i);
		cbox.setAttribute("style", "width: 18px ; height: 18px ");
		cbox.setAttribute("tabindex", "-1");
		cbox.addEventListener('click', boxClicked)


		var listItem = document.createElement('div');
		listItem.setAttribute('class','holder');
		listItem.addEventListener('click',tabClicked);
		
		var thumb = document.createElement("IMG");
		thumb.setAttribute("src",tabs[i].favIconUrl);
		thumb.setAttribute("height","18");
		thumb.setAttribute("width","18");
		thumb.setAttribute("style","margin: 1px 0px")
		var tabNum = document.createElement('span');
		tabNum.innerHTML = " " + shorten(tabs[i].title, 25);
		var del = document.createElement('button');
		del.innerHTML = 'x';
		del.setAttribute('style','position: absolute ; left: 205px');
		listItem.appendChild(cbox);
		listItem.appendChild(thumb);
		listItem.appendChild(tabNum);
		listItem.appendChild(del);
		boxList.appendChild(listItem);

	}
});










