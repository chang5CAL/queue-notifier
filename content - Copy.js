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
      <center><h3 id="popup-text">NoChange</h3></center>
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

port.onMessage.addListener(function(message,sender){
  console.log("got something back");
  console.log(message.main);
  console.log(message.coworkerId);
  var table = document.getElementById('MainContent_RealTimeTeam_GridView1');
  if (typeof message.coworkerId !== "undefined" && table !== null) {
    var coArr = message.coworkerId.split(","); // comes in string format
    var ids = [];
    var mainId = message.main;

    for (var i = 0; i < coArr.length; i++) {
      ids.push(parseInt(coArr[i]));
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
    
    //var elements = document.getElementsByTagName('tr');
    var elements = table.childNodes[1].childNodes;

    function swapBest(id, seconds) {
      secondBest.id = best.id;
      secondBest.seconds = best.seconds;
      best.id = id;
      best.seconds = seconds;
    }

    function swapSecondBest(id, seconds) {
      secondBest.id = id;
      secondBest.seconds = seconds;
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
        if (ids.indexOf(id) != -1 || id == mainId) {
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
            if (best.seconds < seconds) {
              swapBest(id, seconds);
            } else if (secondBest.seconds < seconds) {
              swapSecondBest(id, seconds);
            }
          } else if (id == mainId && (status == "Not Ready" || status == "Work Ready")) {
            if (time > 4 * 60) {
              overNotReady = true;
              break;
            }
          }
        }
      }
    }
    console.log(best);
    console.log(secondBest);

    if (overNotReady) {
      document.getElementById('popup-text').innerText = "You've been non-Ready for " + (time / 60) + " minutes!";
      showPopUp();
    } else if (best.id == mainId) {
      document.getElementById('popup-text').innerText = "You're on top of the queue!";
      showPopUp();
    } else if (secondBest.id == mainId) {
      document.getElementById('popup-text').innerText = "You're 2nd in the queue";
      showPopUp();
    }
	
	setTimeout(function() {
      location.reload();
	  console.log("refresh");
    }, 60 * 1000);
	
  }
});
