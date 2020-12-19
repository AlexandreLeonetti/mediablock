'use strict';

// ----------------- Internationalization ------------------
/*
document.querySelectorAll('[data-i18n]').forEach(node => {
  let [text, attr] = node.dataset.i18n.split('|');
  text = browser.i18n.getMessage(text);
  attr ? node[attr] = text : node.appendChild(document.createTextNode(text));
});*/
// ----------------- /Internationalization -----------------

// ----- global
const textOptionsBlock =  document.querySelector('#textOptionsBlock');
var censorMedia = [];
var censor  = [];

browser.storage.local.get(null, result => {
		  if(typeof result.censor != "undefined" ){
			  censor = result.censor ;
		  }
			if(typeof result.censorMedia != "undefined"){
				censorMedia = result.censorMedia;
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

let word = {};

const newCode =  document.querySelector('#mediaCode');
const newKeyword =  document.querySelector('#wordAddress');
const newMedia =  document.querySelector('#mediaAddress');

// --- add Listeners
document.querySelectorAll('button').forEach(item => item.addEventListener('click', process));

function process() {
  switch (this.dataset.i18n) {
    case 'cancel':
       location.href = '/keyWords.html';
      break;
    case 'saveKeyword':
      if (!validateInput()) { return; }
      browser.storage.local.set(makeword(), () => {
        location.href = '/keyWords.html' ;
      });
      break;
	 case 'saveMedia':
      if (!validateMedia()) { return; }
      browser.storage.local.set(makeMedia(), () => {
        location.href = '/keyWords.html' ;
      });
      break;
	 case 'saveCode':
      if (!validateCode()) { return; }
	  console.log("clicked saveCode");
      browser.storage.local.set(makeCode(), () => {
        location.href = '/keyWords.html' ;
      });
      break;
	 case 'weekBlock':
     
	 console.log("clicked weekBlock");
      browser.storage.local.set(blockForOneWeek(), () => {
        location.href = '/keyWords.html' ;
      });
      break;
  }
}


function validateCode() {
  document.querySelectorAll('input[type="text"]').forEach(item => item.value = item.value.trim());  
  newCode.value = Utils.stripBadChars(newCode.value);  
  newCode.classList.remove('invalid'); // reset
  if (!newCode.value) {
    newCode.classList.add('invalid');
    return false;
  }
  return true;
}

function validateInput() {
  document.querySelectorAll('input[type="text"]').forEach(item => item.value = item.value.trim());  
  newKeyword.value = Utils.stripBadChars(newKeyword.value);  
  newKeyword.classList.remove('invalid'); // reset
  if (!newKeyword.value) {
    newKeyword.classList.add('invalid');
    return false;
  }
  return true;
}
function validateMedia() {
  document.querySelectorAll('input[type="text"]').forEach(item => item.value = item.value.trim());  
  newMedia.value = Utils.stripBadChars(newMedia.value);  
  newMedia.classList.remove('invalid'); // reset
  if (!newMedia.value) {
    newMedia.classList.add('invalid');
    return false;
  }
  return true;
}
function blockForOneWeek() {
	const start = Date.now();
	var blockUntilMS = 604800000+start;

  return {"blockUntil":blockUntilMS};
}

function makeCode() {
  return {["savedCode"]: newCode.value};
}

function makeword() {
   censor.push(newKeyword.value);
  return {["censor"]: censor};
}

function makeMedia() {
	var newMediaCompleted = newMedia.value;//"*://www."+ newMedia.value+"/*";
   censorMedia.push(newMediaCompleted);
  return {["censorMedia"]: censorMedia};
}
