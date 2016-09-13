chrome.runtime.onConnect.addListener(function(port) {
	if (port.name == "content") {
	  port.postMessage({
	  	main: localStorage['main'],
	  	coworkerId: localStorage['coworkerId'],
	  	main2: localStorage['main2'],
	  	coworkerId2: localStorage['coworkerId2'],
	  	main3: localStorage['main3'],
	  	coworkerId3: localStorage['coworkerId3'],

	  });
	} else if (port.name == "background") {
  		port.postMessage({greeting: "background!!"});
	}
});