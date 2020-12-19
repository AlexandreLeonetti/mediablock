maxInterval = 0 ;

var censor = [];

browser.storage.local.get(null, result => {
		  if(typeof result.censor != "undefined" ){
			  censor = result.censor ;
		  }  
});
console.log(window.location.href );

browser.storage.local.get(null, result => {
						if (typeof result.isImagesBlocking != 'undefined')	{
							if (result.isImagesBlocking == 1)	{
							var eliminator = setInterval(()=>{
								
							  var imgs = document.querySelectorAll('img').forEach(function(img){
									img.style.display='none';
							   });
							   

							   
							   
							   	var strongvs = document.querySelectorAll('video').forEach(function(div){
										div.setAttribute('style', 'background-color:white !important; opacity:0; color:white !important;');
							   });								   
							   maxInterval++;
							   //console.log(imgs);
							   if(maxInterval>30){
								   clearInterval(eliminator);
							   }
							},200);
							
							console.log("isImagesBlocking ");
							console.log(result.isImagesBlocking);
							}else{}
						}else{
							
							console.log("storage array has been set");
						}				
});


browser.storage.local.get(null, result => {
						if (typeof result.isKeywordBlocking != 'undefined')	{
							if (result.isKeywordBlocking == 1)	{
								var eliminator = setInterval(()=>{
									
								//KEYWORDS
								  var dvs = document.querySelectorAll('div').forEach(function(div){
								  var strDiv = div.innerText;
						  
									 /*for(var i=0; i<censor.length; i++){
										
										if(strDiv.includes(censor[i])){
											 console.log(div);
											div.setAttribute('style', 'background-color:white !important; opacity:0 !important;color:white !important;');
											for (var j=0; j<div.childNodes.length; j++){
												if (typeof div.childNodes[j].style!= 'undefined'){
													//console.log(div.childNodes[j]);	
													div.childNodes[j].setAttribute('style', 'background-color:white !important; opacity:0 !important;color:white !important;');											
												}
											}
											}else{
											}
									 }*/
									  for(var i=0; i<censor.length; i++){
										if(strDiv.includes(censor[i])){
											console.log(div);
											div.setAttribute('style', 'background-color:white !important; opacity:0 !important; color:white !important;');
											}else{	
											}
									 }
								   });							   
								   
									var avs = document.querySelectorAll('a').forEach(function(div){
									var strDiv = div.innerText;
									
									for(var i=0; i<censor.length; i++){
										if(strDiv.includes(censor[i])){
											console.log(div);
											div.setAttribute('style', 'background-color:white !important; opacity:0 !important; color:white !important;');
											}else{	
											}
									 }
								   });	
								   
								   
								   	var h2 = document.querySelectorAll('h2').forEach(function(div){
									var strDiv = div.innerText;
									  
									 for(var i=0; i<censor.length; i++){
										if(strDiv.includes(censor[i])){
											console.log(strDiv);
											div.setAttribute('style', 'background-color:white !important; opacity:0 !important; color:white !important;');
											}else{	
											}
									 }
								   });	
								   
								   
									var strongvs = document.querySelectorAll('strong').forEach(function(div){
									var strDiv = div.innerText;
									 for(var i=0; i<censor.length; i++){
										if(strDiv.includes(censor[i])){
											div.setAttribute('style', 'background-color:white !important; opacity:0 !important;color:white !important;');
										}else{	
										}
									 }
								   });	// CENSOR KEYWORDS	
									
									
								},200);
							}
						}
});					