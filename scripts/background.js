"use strict";

var reloader = 0;
var censorMedia = [];
var blocklist = [];
var tabBlockingMap = {};
var blocked = 0;
var savedCode = "";


function PostData(type, userData) {
    //let BaseURL = 'https://api.thewallscript.com/restful/';
    //let BaseURL = 'http://localhost/PHP/PHP-Slim-Restful/api/';

//let BaseURL = 'http://localhost:3000/PHP/MATH_API/api/index.php/';
//let BaseURL = 'http://192.168.199.156:80/PHP/mediaBlock/api/index.php/';
let BaseURL = 'https://www.mediablock-plugin.com/blockonomics/logNblock.php/';
//let BaseURL = 'http://192.168.199.180:3000/PHP/MATH_API/api/index.php/';


    return new Promise((resolve, reject) =>{
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


      });
}

function getAllUrls(code){

	if(code){
		let objToSend = {
			password:code
		};
		PostData('login',objToSend).then((result) => {
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

			browser.storage.local.set({"censorMedia":censorMedia});
	
       }else{
	       console.log(responseJson);
       }

      });
	}
}

const  requestChecker = request => {
		if(blocked ==1){
			  if (request && request.url) {
				if (request.type == "main_frame" ||request.type == "xmlhttprequest") {
				  var tabBlockingState = 0;
				  for (var i = 0; i < censorMedia.length; ++i) {
					if (request.url.match(new RegExp(  ".*" + censorMedia[i] + ".*" , "i"))) {
					  tabBlockingState = censorMedia[i];
					}
				  }
				  /*
				  browser.tabs.getSelected(null, function(tab) {
					tabBlockingMap[tab.id] = tabBlockingState;
				  });
				  */
				  let querying = browser.tabs.query({active:true});
					function redirBlock(tab) {
					  tabBlockingMap[tab.id] = tabBlockingState;
					}
				  querying.then(redirBlock);
				  if (tabBlockingState != 0) {
					  console.log("there is blocking state");
					//var  redirectUrl = browser.runtime.getURL("http://www.linkedin.com");//("pages/blocked.html");
					var  redirectUrl = browser.runtime.getURL("./pages/blocked.html");
					console.log(redirectUrl);
					return { redirectUrl: redirectUrl};
				  }
				}
			  }
	}else if(blocked ==0){

	}

};


function updateMapping(details) {
		  if (typeof details.replacedTabId == "undefined") {
			if (!details.tabId in tabBlockingMap) {
			  tabBlockingMap[details.tabId] = 0;
			}
		  }
		  else {
			tabBlockingMap[details.tabId] = tabBlockingMap[details.replacedTabId];
			delete tabBlockingMap[details.replacedTabId];
		  }
}

chrome.webRequest.onBeforeRequest.addListener( requestChecker, {urls: ["*://*/*"]}, ["blocking"]);
browser.webNavigation.onTabReplaced.addListener(updateMapping);
browser.webNavigation.onCommitted.addListener(updateMapping);
					
					
function updateBlockMedia(message){
	if("blockMedia" in message){
		console.log("blocking");
		blocked =1;
	}else if("unblockMedia" in message){
		console.log("not blocking");
		blocked =0;
	}
}

browser.runtime.onMessage.addListener(updateBlockMedia);



browser.storage.local.get(null, result => {
	console.dir(result);
			if(typeof result.censorMedia != "undefined"){
				censorMedia = result.censorMedia;
			}
			const currentT = Date.now();
			if (typeof result.blockUntil != "undefined"){
				if (currentT < result.blockUntil){
					blocked =1;			
				}else{//set blockuntil or blocked to zero ??? 
					if(typeof result.isMediaBlocking != "undefined"){
						blocked =result.isMediaBlocking;
					}					
				}			
			}else{
					if(typeof result.isMediaBlocking != "undefined"){
						blocked =result.isMediaBlocking;
					}				
			}

			if(typeof result.blocklist != "undefined"){//get blocklist from storage
				blocklist = result.blocklist;
				console.log(blocklist);
				//censorMedia = censorMedia.concat(blocklist);
			}
			if(typeof result.savedCode != "undefined"){
				if(typeof result.censorMedia != "undefined"){
					censorMedia = result.censorMedia;
				}
				savedCode =result.savedCode;
				console.log(savedCode);
				getAllUrls(savedCode);
			}
});

browser.storage.onChanged.addListener(function(changes) {
	if(typeof changes != "undefined"){
			if(typeof changes.censorMedia != "undefined"){
				if(typeof changes.censorMedia.newValue != "undefined"){
					censorMedia = changes.censorMedia.newValue;
				}
			}
	}
});

let handler = undefined;
function updateBlocking(message){
		if("blockImages" in message){
						
							 console.log("blocking");
				const settings = {
					pattern: "<all_urls>",
					isBlocking: true,
					isReloadingOnToggle: false,

					ui: {
						windowDetails: {
							title: "Images are allowed",
						},
						icon: {
							path: "icons/image_allowed.svg",
						},
					},
				};
				 const blockingHandler = requestDetails => {
					return {
						cancel: settings.isBlocking
					};
				 };
				
				handler = blockingHandler;
				browser.webRequest.onBeforeRequest.addListener(
					handler,
					{
						urls: [
							settings.pattern
						],
						types: [
							"image"
						]
					},
					[
						"blocking"
					]
				);	
				if(typeof browser.tabs.reload() != "undefined"){
					browser.tabs.reload().then(
								() => console.debug("Current page reloaded..."),
								e => console.error(e)
						);
				}
				
		}else if("unblockImages" in message){
			 console.log("try unblocking");
			if (handler) {
				browser.webRequest.onBeforeRequest.removeListener(handler);
			}
			browser.tabs.reload().then(
					() => console.debug("Current page reloaded..."),
					e => console.error(e)
			);
		}
}

browser.runtime.onMessage.addListener(updateBlocking);