var mainInput = document.getElementById('main');
var coworkerInput = document.getElementById('coworker');

mainInput.value = parseInt(localStorage['main']);
coworkerInput.value = localStorage['coworkerString'];

var mainInput2 = document.getElementById('main2');
var coworkerInput2 = document.getElementById('coworker2');

mainInput2.value = parseInt(localStorage['main2']);
coworkerInput2.value = localStorage['coworkerString2'];

var mainInput3 = document.getElementById('main3');
var coworkerInput3 = document.getElementById('coworker3');

mainInput3.value = parseInt(localStorage['main3']);
coworkerInput3.value = localStorage['coworkerString3'];

function myClick() {
	//chrome.extension.getBackgroundPage().localStorage['main'] = mainInput.value;
	var mainId = parseInt(mainInput.value);
	var coworkerString = coworkerInput.value;
	coworkerArr = coworkerString.split(",");
	coworkerId = [];
	for (var i = 0; i < coworkerArr.length; i++) {
		coworkerId.push(parseInt(coworkerArr[i]));
	}

	var mainId2 = parseInt(mainInput2.value);
	var coworkerString2 = coworkerInput2.value;
	coworkerArr2 = coworkerString2.split(",");
	coworkerId2 = [];
	for (var i = 0; i < coworkerArr2.length; i++) {
		coworkerId2.push(parseInt(coworkerArr2[i]));
	}

	var mainId3 = parseInt(mainInput3.value);
	var coworkerString3 = coworkerInput3.value;
	coworkerArr3 = coworkerString3.split(",");
	coworkerId3 = [];
	for (var i = 0; i < coworkerArr3.length; i++) {
		coworkerId3.push(parseInt(coworkerArr3[i]));
	}

	localStorage['main'] = mainId;
	localStorage['coworkerId'] = coworkerId;
	localStorage['coworkerString'] = coworkerString;

	localStorage['main2'] = mainId2;
	localStorage['coworkerId2'] = coworkerId2;
	localStorage['coworkerString2'] = coworkerString2;

	localStorage['main3'] = mainId3;
	localStorage['coworkerId3'] = coworkerId3;
	localStorage['coworkerString3'] = coworkerString3;
}

var btn = document.getElementById('save');
btn.onclick = myClick;
