'use strict';
var blocklist = [];
// ----------------- Internationalization ------------------
document.querySelectorAll('[data-i18n]').forEach(node => {
  let [text, attr] = node.dataset.i18n.split('|');
  text = browser.i18n.getMessage(text);
  //debugger;
  attr ? node[attr] = text : node.appendChild(document.createTextNode(text));
});
// ----------------- /Internationalization -----------------

// ----- global
const accounts = document.querySelector('#accounts');
const medias = document.querySelector('#medias');
const popup = document.querySelector('.popup');
const popupMain = popup.children[0];
const currentCode =  document.querySelector('#currentCode');
let storageArea, minIndex = Number.MAX_SAFE_INTEGER;
let savedCode = "";
// ----------------- User Preference -----------------------
browser.storage.local.get(null, result => {
  storageArea =  browser.storage.local;
  //console.dir(result);
  result ?  processOptions(result) : processOptions(result);
  result ?  processMedia(result) : processMedia(result);
			  if(typeof result.savedCode != "undefined"){
				  
								savedCode =result.savedCode;
								getAllUrls(savedCode); 
							currentCode.innerHTML = "Your current subscription code is : <strong>"+savedCode+"</strong>";  
			  }

  			if (typeof result.blockUntil != "undefined"){
				const currentT = Date.now();
				if (currentT < result.blockUntil){
					textOptionsBlock.innerText="websites blocked until 7 days period elapsed.";
				}else{
					textOptionsBlock.innerText="Block all unwanted medias for one week.";					
				}
			}
  
});

// ----------------- Spinner -------------------------------TO BE CHANGED
const spinner = document.querySelector('.spinner');
function hideSpinner() {
  spinner.classList.remove('on');
  setTimeout(() => { spinner.style.display = 'none'; }, 600);
}

function showSpinner() {
  spinner.style.display = 'flex';
  spinner.classList.add('on');
}
// ----------------- /spinner ------------------------------/TO BE CHANGED


// ----- add Listeners for menu
document.querySelectorAll('nav a').forEach(item => item.addEventListener('click', process));
function process() {
  switch (this.dataset.i18n) {
    case 'add':
      location.href = '/addWord.html';
      break;
  }
}



function processOptions(pref) {
  // --- reset
  accounts.textContent = '';
  // ----- templates & containers
  const docfrag = document.createDocumentFragment();
  const docfrag2 = document.createDocumentFragment();
  const temp = document.querySelector('.template');
//console.dir(temp);
  // --- working directly with DB format
  const prefKeys = Object.keys(pref); // not for these
//console.dir(pref.censor);
 // pref.censor
		if(typeof pref.censor != "undefined"){
			  for(var i =0 ; i<pref.censor.length; i++){
				  var id=i;
					console.log("censored");
					console.dir(pref.censor[id]);
				const item = pref.censor[id];

				const div = temp.cloneNode(true);
				const node = [...div.children[0].children];//, ...div.children[1].children];
				div.classList.remove('template');
				div.id = id;
				//console.dir(node);
			  
				node[0].textContent = pref.censor[id]; // ellipsis is handled by CSS
				//console.dir(node[0].textContent);
				docfrag.appendChild(div);
				// add to select
				const opt = new Option(node[0].textContent, id);
				opt.style.color = "";
				docfrag2.appendChild(opt);
			 }
		}

  docfrag.hasChildNodes() && accounts.appendChild(docfrag);
  // add Listeners
  document.querySelectorAll('button').forEach(item => item.addEventListener('click', processButton));

  doWeHaveKeyWordsDefined();
  hideSpinner();
}

function processMedia(pref) {
  browser.storage.local.get(null, result => {
			if (typeof result.blockUntil != "undefined"){
				const currentT = Date.now();
				if (currentT < result.blockUntil){
					console.log("weekblock");
					//media button display none show blocked.!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
				  // --- reset
				  medias.textContent = '';
				  // ----- templates & containers
				  const docfrag = document.createDocumentFragment();
				  const docfrag2 = document.createDocumentFragment();
				  const temp = document.querySelector('.templateMediaWeek');
				console.dir(temp);
				  // --- working directly with DB format
				  const prefKeys = Object.keys(pref); // not for these
				console.dir(pref.censorMedia);

				  for(var i =0 ; i<pref.censorMedia.length; i++){
					  var id=i;
						console.log("censored");
						console.dir(pref.censorMedia[id]);
					const item = pref.censorMedia[id];

					const div = temp.cloneNode(true);
					const node = [...div.children[0].children];//, ...div.children[1].children];
					div.classList.remove('templateMediaWeek');
					div.id = id;
					console.dir(node);
				  
					node[0].textContent = pref.censorMedia[id]; // ellipsis is handled by CSS
					console.dir(node[0].textContent);
					docfrag.appendChild(div);
					// add to select
					const opt = new Option(node[0].textContent, id);
					opt.style.color = "";
					docfrag2.appendChild(opt);
				 }

				  docfrag.hasChildNodes() && medias.appendChild(docfrag);
				  // add Listeners
				  document.querySelectorAll('button').forEach(item => item.addEventListener('click', processButton));

				  doWeHaveMediaDefined();
				  hideSpinner();
  
				}else{
						//do nothing
					  // --- reset
					  medias.textContent = '';
					  // ----- templates & containers
					  const docfrag = document.createDocumentFragment();
					  const docfrag2 = document.createDocumentFragment();
					  const temp = document.querySelector('.templateMedia');
					console.dir(temp);
					  // --- working directly with DB format
					  const prefKeys = Object.keys(pref); // not for these
					console.dir(pref.censorMedia);

					  for(var i =0 ; i<pref.censorMedia.length; i++){
						  var id=i;
							console.log("censored");
							console.dir(pref.censorMedia[id]);
						const item = pref.censorMedia[id];

						const div = temp.cloneNode(true);
						const node = [...div.children[0].children];//, ...div.children[1].children];
						div.classList.remove('templateMedia');
						div.id = id;
						console.dir(node);
					  
						node[0].textContent = pref.censorMedia[id]; // ellipsis is handled by CSS
						console.dir(node[0].textContent);
						docfrag.appendChild(div);
						// add to select
						const opt = new Option(node[0].textContent, id);
						opt.style.color = "";
						docfrag2.appendChild(opt);
					 }

					  docfrag.hasChildNodes() && medias.appendChild(docfrag);
					  // add Listeners
					  document.querySelectorAll('button').forEach(item => item.addEventListener('click', processButton));

					  doWeHaveMediaDefined();
					  hideSpinner();
  						
				}			
			}else{
									//do nothing
				  // --- reset
				  medias.textContent = '';
				  // ----- templates & containers
				  const docfrag = document.createDocumentFragment();
				  const docfrag2 = document.createDocumentFragment();
				  const temp = document.querySelector('.templateMedia');
				console.dir(temp);
				  // --- working directly with DB format
				  const prefKeys = Object.keys(pref); // not for these
				console.dir(pref.censorMedia);

				  for(var i =0 ; i<pref.censorMedia.length; i++){
					  var id=i;
						console.log("censored");
						console.dir(pref.censorMedia[id]);
					const item = pref.censorMedia[id];

					const div = temp.cloneNode(true);
					const node = [...div.children[0].children];//, ...div.children[1].children];
					div.classList.remove('templateMedia');
					div.id = id;
					console.dir(node);
				  
					node[0].textContent = pref.censorMedia[id]; // ellipsis is handled by CSS
					console.dir(node[0].textContent);
					docfrag.appendChild(div);
					// add to select
					const opt = new Option(node[0].textContent, id);
					opt.style.color = "";
					docfrag2.appendChild(opt);
				 }

				  docfrag.hasChildNodes() && medias.appendChild(docfrag);
				  // add Listeners
				  document.querySelectorAll('button').forEach(item => item.addEventListener('click', processButton));

				  doWeHaveMediaDefined();
				  hideSpinner();
									
			}   
  }  );
}


function doWeHaveKeyWordsDefined() {

  if (!accounts.hasChildNodes()) {
	  	//console.log("doWeHaveKeyWordsDefined");
    document.querySelector('#help').style.display = 'block';
    //document.querySelector('#rightColumn').classList.add('secondary');
    //document.querySelector('#mode').style.display = 'none';
  }
  else {
    document.querySelector('#help').style.display = 'none';
    document.querySelector('#rightColumn').classList.remove('warning');
    //document.querySelector('#mode').style.display = 'flex';
  }
}

function doWeHaveMediaDefined() {
	
  if (!medias.hasChildNodes()) {
	  //console.log("doWeHaveMediaDefined");
    document.querySelector('#helpMedia').style.display = 'block';
    document.querySelector('#rightColumnMedia').classList.add('secondary');
    //document.querySelector('#mode').style.display = 'none';
  }
  else {
    document.querySelector('#helpMedia').style.display = 'none';
    document.querySelector('#rightColumnMedia').classList.remove('warning');
    //document.querySelector('#mode').style.display = 'flex';
  }
}

function removeCensorElt(index){
	
	browser.storage.local.get(null, result => {
		var censorArr = 	result.censor ;
		censorArr.splice(index,1);
		 storageArea.set({["censor"]: censorArr}, () => {   console.log("deleted");  });
});
}

function removeMediaElt(index){
	browser.storage.local.get(null, result => {
		var censorArr = 	result.censorMedia ;
		censorArr.splice(index,1);
		 storageArea.set({["censorMedia"]: censorArr}, () => {   console.log("deleted");  });
	});
}

function processButton() {

  const parent = this.parentNode.parentNode;
  const id = parent.id;

  switch (this.dataset.i18n) {

    case 'help|title':
      //popupMain.children[0].textContent = browser.i18n.getMessage('syncSettings');
      popupMain.children[1].textContent = browser.i18n.getMessage('syncSettingsHelp');
      popupMain.children[2].children[0].style.visibility = 'hidden';
      popupMain.children[2].children[1].addEventListener('click', closePopup);
      showPopup();
      break;

    case 'delete|title':   
        parent.style.opacity = 0;
        setTimeout(() => { parent.remove(); doWeHaveKeyWordsDefined();}, 600);          // remove row
        removeCensorElt(id);
		//console.log("keyword"+id);
		storageArea.remove(id);
		 location.href = '/keyWords.html' 
      break;
	  
	case 'deleteMedia':
  
        parent.style.opacity = 0;
        setTimeout(() => { parent.remove(); doWeHaveKeyWordsDefined();}, 600);          // remove row
        removeMediaElt(id);
				//console.log("media" +id);
		storageArea.remove(id);
		 location.href = '/keyWords.html' 
     
      break;

    case 'up|title':
    case 'down|title':
      const target = this.dataset.i18n === 'up|title' ? parent.previousElementSibling : parent.nextElementSibling;
      const insert = this.dataset.i18n === 'up|title' ? target : target.nextElementSibling;
      parent.parentNode.insertBefore(parent, insert);
      parent.classList.add('on');
      setTimeout(() => { parent.classList.remove('on'); }, 600);
      storageArea.get(null, result => {
        // re-index
        //[...accounts.children].forEach((item, index) => item.id !== LASTRESORT && (result[item.id].index = index));
        [...accounts.children].forEach((item, index) => {if(item.id!="password"&&item.id!="accountId"&&item.id!="deviceId"&&item.id!="mode"){result[item.id].index = index; /*console.dir(item.id);*/}});
        minIndex = 0; // minimum index is always 0 now
        storageArea.set(result);
      });
      break;
  }
}

function showPopup() {

  popup.style.display = 'flex';
  window.getComputedStyle(popup).opacity;
  window.getComputedStyle(popup.children[0]).transform;
  popup.classList.add('on');
}

function closePopup() {

  popup.classList.remove('on');
  setTimeout(() => {
    popup.style.display = 'none';
    // reset
    popupMain.children[0].textContent = '';
    popupMain.children[1].textContent = '';
    popupMain.children[2].children[0].style.visibility = 'visible';
    popupMain.replaceChild(popupMain.children[2].cloneNode(true), popupMain.children[2]); // cloning to remove listeners
  }, 600);
}

var PostData = (type, userData) => {

let BaseURL = 'https://www.mediablock-plugin.com/blockonomics/logNblock.php/';
return new Promise((resolve, reject) =>{
            fetch(BaseURL+type, {
            method: 'POST',
            body: JSON.stringify(userData)
          }).then(status)
          .then((response) => response.json())
          .then((res) => {

            console.log("response from Postdata "+JSON.stringify(res));
            //res = {"ok":"ok"}
            resolve(res);
          })
          .catch((error) => {
            console.log("error in promise "+error);
            console.log("type "+type);
            console.dir(userData);
			document.querySelector('#connError').innerText="Connection error, could not update the blocklist.";
            reject(error);
          });


      });
		function status(res) {
			if (!res.ok) {
				
				document.querySelector('#connError').innerText="Server error, could not update the blocklist.";
				throw new Error(res.statusText);
			}
			return res;
		}
  /*  return new Promise((resolve, reject) =>{
            fetch(BaseURL+type, {
            method: 'POST',
            body: JSON.stringify(userData)
          })
          .then((response) => response.json())
          .then((res) => {

            console.log("response from Postdata "+JSON.stringify(res));
            //res = {"ok":"ok"}
            resolve(res);
          })
          .catch((error) => {
            console.log("error in promise "+error);
            console.log("type "+type);
            console.dir(userData);
            reject(error);
          });


      });*/
}

var getAllUrls = (code) => {

	if(code){
		let objToSend = {
			password:code
		};
		globalThis.PostData('login',objToSend).then((result) => {
			let responseJson = result;
			if(responseJson){
			   //  sessionStorage.setItem('userData',JSON.stringify(responseJson));
			   //  localStorage.setItem('userData',JSON.stringify(responseJson));
				console.dir(responseJson);
				for(var i=0;i<responseJson.length;i++){
					blocklist[i]=responseJson[i]["url"];
				}
				console.dir(blocklist);
				//UNICITY FILTER HERE.
				
				
				var CreateDBvsPageObj = (censorMedia) => {
					var baseNpage = {};
								for (var j in censorMedia) {               //
									baseNpage[censorMedia[j]] = censorMedia[j];   // EMAIL vs local dataBASE {}
								}
					return baseNpage ;
				}

				
			var	baseNpage = CreateDBvsPageObj (censorMedia);
			var LoopMailSender = (blocklist, baseNpage, censorMedia ) => {
							console.log("entered mail sender");
							for (var i in blocklist){																// LOOP through EMAILS		
								if (typeof baseNpage[blocklist[i]] != 'undefined'){								// IF known already, then get IGNORED
											console.log("Email already known, cant spam this adress");
								}else{
											 censorMedia.push(blocklist[i]); // to be CHANGED !
								}
							}
				}
				
				LoopMailSender (blocklist, baseNpage, censorMedia );
				//UNICITY FILTER end HERE.

			chrome.storage.local.set({"censorMedia":censorMedia});
			chrome.storage.local.get(null, result => {
				 result ?  processMedia(result) : processMedia(result);	
			});
	
       }else{
	       console.log(responseJson);
       }

      });
	}
}