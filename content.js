var port = chrome.runtime.connect({name:"content"});

var html = `<style type="text/css">
#abc {
  width:100%;
  height:100%;
  opacity:.95;
  top:0;
  left:0;
  display:none;
  position:fixed;
  background-color:#313131;
  overflow:auto
}
img#close {
position:absolute;
right:-14px;
top:-14px;
cursor:pointer
}
div#popupContact {
position:absolute;
left:50%;
top:17%;
margin-left:-202px;
background-color: white;
height: 200px;
width: 400px;
font-family:"Raleway",sans-serif
}
</style>


<div id="abc">
  <!-- Popup Div Starts Here -->
  <div id="popupContact">
      <center><h3 id="popup-text"></h3></center>
  </div>
</div>`;

document.body.innerHTML += html;

document.onkeydown = function(evt) {
  evt = evt || window.event;
  var isEscape = false;
  if ("key" in evt) {
    isEscape = evt.key == "Escape";
  } else {
    isEscape = evt.keyCode == 27;
  }
  if (isEscape) {
    document.getElementById('abc').style.display = "none";
  }
};

// click the button
var a = document.getElementsByTagName("a")
for (var i = 0; i < a.length; i++) {
  if (a[i].innerText == "State Duration") {
    a[i].click();
    break;
  }
}
var MAX = 3;
port.onMessage.addListener(function(message,sender){
  console.log("got something back");
  console.log(message.main);
  console.log(message.coworkerId);
  var table = document.getElementById('MainContent_RealTimeTeam_GridView1');
  if (typeof message.coworkerId !== "undefined" && typeof message.coworkerId2 !== "undefined" && typeof message.coworkerId3 !== "undefined" && table !== null) {
    var coArrList = [];
    coArrList.push(message.coworkerId.split(','));
    coArrList.push(message.coworkerId2.split(','));
    coArrList.push(message.coworkerId3.split(','));
    mainIdList = [];
    mainIdList.push(message.main);
    mainIdList.push(message.main2);
    mainIdList.push(message.main3);

    var idsList = [];
    var bestList = [];
    var secondBestList = [];
    var overNotReadyList = [];

    for (var i = 0; i < MAX; i++) {
      var ids = [];
      for (var j = 0; j < coArrList[i].length; j++) {
        ids.push(parseInt(coArrList[i][j]));
      }
      var best = {
        id: -1,
        seconds: 0,
      };
      var secondBest = {
        id: -1,
        seconds: 0,
      };

      var overNotReady = false;
      idsList.push(ids);
      bestList.push(best);
      secondBestList.push(secondBest);
      overNotReadyList.push(overNotReady);

    }
    
    //var elements = document.getElementsByTagName('tr');
    var elements = table.childNodes[1].childNodes;

    function swapBest(id, seconds, index) {
      secondBestList[index].id = bestList[index].id;
      secondBestList[index].seconds = bestList[index].seconds;
      bestList[index].id = id;
      bestList[index].seconds = seconds;
    }

    function swapSecondBest(id, seconds, index) {
      secondBestList[index].id = id;
      secondBestList[index].seconds = seconds;
    }

    function showPopUp() {
      document.getElementById('abc').style.display = "block";
      window.setTimeout(function() {
        document.getElementById('abc').style.display = "none";
      }, 3000);
    }

    for (var i = 0; i < elements.length; i++) {
      var element = elements[i];
      if (element.childNodes.length == 10) {
        var id = parseInt(element.childNodes[3].innerText);
        for (j = 0; j < MAX; j++) {
          console.log(idsList);
          if (idsList[j].indexOf(id) != -1 || id == mainIdList[j]) {
            console.log("looking at " + id);
            var status = element.childNodes[4].innerText;
            var time = element.childNodes[5].innerText.split(":");
            var seconds = 0;
            if (time.length == 3) {
              seconds = (parseInt(time[0]) * 60 * 60) + (parseInt(time[1]) * 60) + parseInt(time[2])  
            } else {
              seconds = (parseInt(time[0]) * 60) + parseInt(time[1]);
            }
            if (status == "Ready") {    
              if (bestList[j].seconds < seconds) {
                swapBest(id, seconds, j);
              } else if (secondBestList[j].seconds < seconds) {
                swapSecondBest(id, seconds, j);
              }
            } else if (id == mainIdList[j] && (status == "Not Ready" || status == "Work Ready")) {
              if (time > 4 * 60) {
                bestList[j].seconds = time;
                overNotReadyList[j] = true;
                break;
              }
            }
          }
        }
      }
    }
    console.log(bestList);
    console.log(secondBestList);

    var change = false;

    for (var i = 0; i < MAX; i++) {
      if (overNotReadyList[i]) {
        document.getElementById('popup-text').innerText += "You have been non-Ready for " + (bestList[i].seconds / 60) + " minutes!";
        change = true;
      } else if (bestList[i].id == mainIdList[i]) {
        document.getElementById('popup-text').innerText += "You are 1st in queue " + i + "!";
        change = true;
      } else if (secondBestList[i].id == mainIdList[i]) {
        document.getElementById('popup-text').innerText += "You are 2nd in queue " + i + "!";
        change = true;
      }      
    }

    if (change) {
      showPopUp();
    }
	
	 setTimeout(function() {
      location.reload();
	  console.log("refresh");
    }, 60 * 1000);
	
  }
});
