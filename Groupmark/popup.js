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

	var uncheckAll = document.getElementById('uncheckAll');   
    uncheckAll.addEventListener('click', uncheck);

    var save = document.getElementById('saveState');
    save.addEventListener('click', saveState);

    var saveUnSel = document.getElementById('saveClearSel');
    saveUnSel.addEventListener('click', saveState);

    var clearAll = document.getElementById('saveClearAll');
    clearAll.addEventListener('click', saveState);

    chrome.tabs.query({currentWindow: true}, function(tabs){
	    for(i = 0 ; i < tabs.length ; i++) {
	    	var box = document.getElementById(i);
	    	box.addEventListener('change', boxChange);
	    }
	})

	// var clear = document.getElementById('clearGm');
 //    clear.addEventListener('click', clearGm);

    document.getElementById("myGm").addEventListener('click',toggle);

    window.onclick = function(event) {
    	if (!event.target.matches('.dropbtn') && !event.target.matches('.dropdown-content') && !event.target.matches('.dropdownOps')) {

		    var dropdowns = document.getElementsByClassName("dropdown-content");
		    var i;
		    for (i = 0; i < dropdowns.length; i++) {
	        	var openDropdown = dropdowns[i];
	        	if (openDropdown.classList.contains('show')) {
	        		openDropdown.classList.remove('show');
	      		}
	    	}
	    	closeChoices();
  		}
	}

}

////////////////////////////////////////////////////////////////////////

function shorten(text, maxLength) {
	var ret = text;
	if (ret.length > maxLength) {
		ret = ret.substr(0,maxLength-4) + '...';
	}
	return ret;
}

function toggle() {


	if(selectedOpen === true) {
		closeChoices();
		
	}

	document.getElementById("myDropdown").classList.toggle("show");
}


function uncheck() {

	for(i = 0 ; i < boxes ; i++) {
    		var rmv = document.getElementById(i);
    		var rplc = document.createElement("input");
    		rplc.setAttribute("id",i);
    		rplc.setAttribute("value", "deselected");
    		rplc.setAttribute("style", "width: 14px ; height: 14px")
			var boxList = document.getElementById("tabs");    		
			rplc.setAttribute("type","checkbox");
    		rmv.parentNode.replaceChild(rplc,rmv);
    		rplc.addEventListener('change', boxChange);
    }
    boxesChecked = 0;
    document.getElementById("here").innerHTML = "You must select at least one tab";
}


function saveState() {
	
	var nameTaken = false;

	var saveType =this.id;
	
	chrome.tabs.query({currentWindow: true}, function(tabs){
		var savedTabsUrls = [];
		var savedTabsNames = [];

		for(i = 0 ; i < tabs.length ; i++){
			if(document.getElementById(i).getAttribute("value") === "selected") {
				savedTabsUrls.push(tabs[i].url);
				savedTabsNames.push(tabs[i].title);
			}
		}
		if(savedTabsUrls.length != 0) {	
			var name = document.getElementById("groupName").value;
			
			if(name === "untitled"){
				name += " " + Date();
			}

			chrome.bookmarks.getChildren('2',function(otherBookmarks){
				
				var found = false;
				for(i = 0 ; i < otherBookmarks.length ; i ++) {
					if(otherBookmarks[i].title === 'Tab Cabinet') {
						var found = true;
						mainFolderId = otherBookmarks[i].id;
						break;
					}
				}

				if(found === false) {

					chrome.bookmarks.create({'index':0, 'title':'Tab Cabinet'}, function(newFolder){
						mainFolderId = newFolder.id;

						chrome.bookmarks.create({'parentId': mainFolderId,'index':0, 'title': name}, function(newGroupmark){
							for(i = 0; i < savedTabsUrls.length; i++) {
								chrome.bookmarks.create({'parentId': newGroupmark.id, 'url': savedTabsUrls[i], 'title': savedTabsNames[i]}, 
									function(blah){});
							}
						});
					});
				}

				else if(found === true) {

					chrome.bookmarks.getChildren(mainFolderId, function(savedGms){
						for (i = 0 ; i < savedGms ; i++) {
							if(savedGms[i].title === name) {
								nameTaken = true;
								toReplaceID = savedGms[i].id;
								toRaplaceName = name;
								updateConfirm();
							}
						}
					});

					if (nameTaken === false) {
						chrome.bookmarks.create({'parentId': mainFolderId,'index':0, 'title': name}, function(newGroupmark){
							for(i = 0; i < savedTabsUrls.length; i++) {
									chrome.bookmarks.create({'parentId': newGroupmark.id, 'url': savedTabsUrls[i], 'title': savedTabsNames[i]}, 
										function(blah){});
							}
						});
					}
					
				}

				if (nameTaken === false) {
					if(saveType === "saveState"){
					 	var e = document.body;
	   					e.innerHTML = "<p>New tab group saved!</p>";
		        	}

		        	else if(saveType === "saveClearSel") {
		        		saveClearSel();
		       		}

	        		else if(saveType === "saveClearAll") {	        		
		        		saveClearAll();
		       		}
		       	}
			});
		}
	
	});
}

function updateConfirm() {
	document.getElementById('saveState').setAttribute('class','hide');
	document.getElementById('saveClearSel').setAttribute('class','hide');
	document.getElementById('saveClearAll').setAttribute('class','hide');

	document.getElementById('updatePrompt').removeAttribute('class');
	document.getElementById('replace').removeAttribute('class');
	document.getElementById('cancelSave').removeAttribute('class');
}

function replace() {
	chrome.bookmarks.removeTree(toReplaceID, function(){});

	chrome.bookmarks.create({'parentId': mainFolderId,'index':0, 'title': toReplaceName}, function(newGroupmark){
		for(i = 0; i < savedTabsUrls.length; i++) {
			chrome.bookmarks.create({'parentId': newGroupmark.id, 'url': savedTabsUrls[i], 'title': savedTabsNames[i]}, 
			function(blah){});
		}
	});
}

function  cancelSave() {
	document.getElementById('saveState').removeAttribute('class');
	document.getElementById('saveClearSel').removeAttribute('class');
	document.getElementById('saveClearAll').removeAttribute('class');

	document.getElementById('updatePrompt').setAttribute('class','hide');
	document.getElementById('replace').setAttribute('class','hide');
	document.getElementById('cancelSave').setAttribute('class','hide');
}


function saveClearSel() {
	chrome.tabs.query({currentWindow: true}, function(tabs){		    
		
		var clearedTabs = [];
		for(i = 0 ; i < tabs.length ; i++){
			if(document.getElementById(i).getAttribute("value") === "selected") {
				clearedTabs.push(tabs[i].id);
			}
		}
		chrome.tabs.remove(clearedTabs,function(){});
	});

}


function saveClearAll() {
	
	chrome.tabs.query({currentWindow: true}, function(tabs){
	var clearedTabs = [];
		for(i = 0 ; i < tabs.length ; i++){
			
			clearedTabs.push(tabs[i].id);
		
		}
		chrome.tabs.remove(clearedTabs,function(){});
	});

	chrome.windows.create({        
                state: 'normal',               
                focused: true              
    });
}


function boxChange(){
	if(this.getAttribute("value") === "selected") {
		this.setAttribute("value","deselected");
		boxesChecked--;
		
		if(boxesChecked === 0) {
			document.getElementById("here").innerHTML = "You must select at least one tab";
		}
		else {
			document.getElementById("here").innerHTML = boxesChecked +" of "+boxes+" tabs selected";
		}
	}
	else if(this.getAttribute("value") === "deselected") {
		this.setAttribute("value","selected");
		boxesChecked++;
		document.getElementById("here").innerHTML = boxesChecked +" of "+boxes+" tabs selected";
	}
}


function clearGm() {
	chrome.storage.sync.clear();
	cleared = true;
	refreshSaves();
}


function selectGm() {	
	var openedId = this.id;
	var isSame = false;

	if(selectedOpen || confirmOpen) {
		
		
		var prevOpened = document.getElementById('opened');
			
		if(prevOpened.parentNode.getAttribute('id') === openedId) {
			isSame = true;
			selectedOpen = false;
		}


		if(confirmOpen) {
			if(isSame === false) {
				confirmOpen = false;
			}
		}

		prevOpened.parentNode.removeChild(prevOpened);
	}

	if(!isSame) {

		var urls = [];
		var rmvd = document.getElementById(openedId);
		var choices = document.createElement('div');
		choices.setAttribute("style", "background-color: #e6e6e6");

		choices.setAttribute('id', 'opened');
		br = document.createElement('br');
		rmvd.appendChild(br);
		rmvd.appendChild(choices,rmvd);

		var sameWin = document.createElement('a');
		sameWin.innerHTML = 'Open in current window';
		sameWin.setAttribute('class','dropdownOps');
		sameWin.addEventListener('click', openCurWin);

		choices.appendChild(sameWin);

		var newWin = document.createElement('a');
		newWin.innerHTML = 'Open in new window';
		newWin.setAttribute('class','dropdownOps');
		newWin.addEventListener('click', openNewWin);

		choices.appendChild(newWin);

		var delGm = document.createElement('a');
		delGm.innerHTML = 'Delete';
		delGm.setAttribute('class','dropdownOps');
		delGm.setAttribute('style','color: red');
		delGm.addEventListener('click', confirmDelGM);

		choices.appendChild(delGm);

		selectedOpen = true;
	}

	if(!!document.getElementById('opened') === false && confirmOpen === true) {
		confirmOpen = false;
	}
	document.getElementById('test').innerHTML = selectedOpen + " " + confirmOpen + " " + !!document.getElementById('opened');

}

function openCurWin() {
	openedId = this.parentNode.parentNode.getAttribute("id");
	chrome.bookmarks.getChildren(openedId, function(openedGm){
		for(i = 0; i < openedGm.length ; i++) {
			chrome.tabs.create({url: openedGm[i].url}, function(){});
		}
	});
}

function openNewWin() {
	openedId = this.parentNode.parentNode.getAttribute("id");
	var urls = [];
	chrome.bookmarks.getChildren(openedId, function(openedGm){
		for(i = 0; i < openedGm.length ; i++) {
			urls.push(openedGm[i].url);
		}
		chrome.windows.create({
            url: urls,
            state: 'normal',               
            focused: true              
        });
	});
}

function confirmDelGM(){

	confirmOpen = true;

	var choices = document.createElement('div');
	choices.setAttribute("style", "background-color: #e6e6e6");
	choices.setAttribute('id', 'opened');
	this.parentNode.parentNode.appendChild(choices);
	
	var prompt = document.createElement('div');
	prompt.setAttribute('class', 'dropdownOps');
	prompt.innerHTML = 'Are you sure?';
	prompt.setAttribute("style","border: .5px solid red ; padding: 7px 2px 7px 4.5px ; background-color: #ffcccc");

	choices.appendChild(prompt);

	var confirm = document.createElement('a');
	confirm.setAttribute('class', 'dropdownOps');
	confirm.innerHTML = "Yes, delete"
	confirm.addEventListener('click', deleteGM);

	choices.appendChild(confirm);

	var cancel = document.createElement('a');
	cancel.setAttribute('class', 'dropdownOps');
	cancel.innerHTML = "Cancel"
	cancel.addEventListener('click', cancelDel);

	choices.appendChild(cancel);
}

function deleteGM() {
	toDeleteID = this.parentNode.parentNode.getAttribute('id');
	chrome.bookmarks.removeTree(toDeleteID, function(){
		document.getElementById('test').innerHTML = "deleted!";
	});
	closeChoices();
}

function cancelDel() {
	closeChoices();
}

function closeChoices() {
	chrome.bookmarks.getChildren(mainFolderId, function(savedGms){

				document.getElementById("myDropdown").innerHTML = "";

				if(savedGms.length === 0) {
					msg = document.createElement('a');
					msg.innerHTML = 'You have no saved groups!';
					var saveSpace = document.getElementById("myDropdown");
					saveSpace.appendChild(msg);
				}
				else {
					for(i = 0 ; i < savedGms.length; i++){
						var save = document.createElement('a');
						numSaves = savedGms.length;
						save.innerHTML = savedGms[i].title;
						save.setAttribute("id",savedGms[i].id);
						save.setAttribute("class","dropdownOps");
						save.addEventListener('click',selectGm);
						console.info(savedGms[i]); 
						var saveSpace = document.getElementById("myDropdown");
						saveSpace.appendChild(save);	
						
					}		
				}

				selectedOpen = false;
				confirmOpen = false;
				document.getElementById('test').innerHTML = selectedOpen + "-" + confirmOpen + "-" + !!document.getElementById('opened');	
	});
}


function refreshSaves(){
	
	for(i=0 ; i<numSaves ; i++) {
		var rmv = document.getElementById((i+1000));
		rmv.parentNode.removeChild(rmv);
	}
	numSaves = 0;

	if(!cleared) {
		chrome.storage.sync.get("saves",function(data) {

			if(!(typeof data.saves ==="undefined")){
				for(i = 0 ; i < data.saves.length ; i++){
					var save = document.createElement('a');
					numSaves = data.saves.length;
					save.innerHTML = data.saves[i][data.saves[i].length-1];
					save.setAttribute("id",i+1000);
					save.setAttribute("style", "width:195px; background-color:white; border-color:white; box-shadow-color:white");
					save.addEventListener('click',selectGm);

					var saveSpace = document.getElementById("myDropdown");
					saveSpace.appendChild(save);
					
				}
			}

			else {
				document.getElementById(savedGroups).innerHTML = "No saved Groupmarks.";
			}
		})
	}
	cleared = false;
}


//////////////////////////////////////////////////////////

// Get tabs in current window

chrome.tabs.query({currentWindow: true}, function(tabs){
	boxes = tabs.length;
	boxesChecked = tabs.length;
	document.getElementById("groupName").focus();

	
	var boxList = document.getElementById("tabs");

	// document.getElementById("here").innerHTML = tabs.length +" of "+tabs.length+" tabs selected";
	
	for(i = 0 ; i < tabs.length ; i++){
		var cbox = document.createElement('input');
		cbox.setAttribute("type","checkbox");
		cbox.setAttribute("checked","checked");
		cbox.setAttribute("value","selected");
		cbox.setAttribute("id",i);
		cbox.setAttribute("style", "width: 14px ; height: 14px")
		
		var thumb = document.createElement("IMG");
		thumb.setAttribute("src",tabs[i].favIconUrl);
		thumb.setAttribute("height","16");
		thumb.setAttribute("width","16");
		thumb.setAttribute("style","margin: -3px 0px")
		var tabNum = document.createTextNode(" " + shorten(tabs[i].title,23));
		boxList.appendChild(cbox);
		boxList.appendChild(thumb);
		boxList.appendChild(tabNum);
		var br = document.createElement('br');
		br.setAttribute('class','small');
		boxList.appendChild(br);	
	}
});

// Get saves

chrome.bookmarks.getChildren('2',function(otherBookmarks){
				
	var found = false;
	for(i = 0 ; i < otherBookmarks.length ; i ++) {
		if(otherBookmarks[i].title === 'Tab Cabinet') {
			var found = true;
			mainFolderId = otherBookmarks[i].id;
			break;
		}		
	}

	var msg;

	console.info(!!document.getElementById('opened'));
	if(found === true){

		chrome.bookmarks.getChildren(mainFolderId, function(savedGms){
			console.info(savedGms);

			if(savedGms.length === 0) {
				msg = document.createElement('a');
				msg.innerHTML = 'You have no saved groups!';
				var saveSpace = document.getElementById("myDropdown");
				saveSpace.appendChild(msg);
			}
			else {
				for(i = 0 ; i < savedGms.length; i++){
					var save = document.createElement('a');
					numSaves = savedGms.length;
					save.innerHTML = savedGms[i].title;
					save.setAttribute("id",savedGms[i].id);
					save.setAttribute("class","dropdownOps");
					save.addEventListener('click',selectGm);
					console.info(savedGms[i]); 
					var saveSpace = document.getElementById("myDropdown");
					saveSpace.appendChild(save);	
					
				}
			}
			selectedOpen = false; 
			confirmOpen = false;
		});
	}
	else if(found === false){
		var saveSpace = document.getElementById("myDropdown");
		msg = document.createElement('a');
		msg.innerHTML = 'You have no saved groups!';
		var saveSpace = document.getElementById("myDropdown");
		saveSpace.appendChild(msg);
	}
});









