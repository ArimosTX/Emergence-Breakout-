window.onload = function () {
  var socket = io.connect("http://24.16.255.56:8888");
  const STATE = "tommySave";

  var text = document.getElementById("text");
  var saveButton = document.getElementById("save");
  var loadButton = document.getElementById("load");

  saveButton.onclick = function () {
    console.log("save");
    text.innerHTML = "Saved."
    socket.emit("save", { studentname: "Tommy Pham", statename: "BreakoutState", data: saveState() });
  };

  loadButton.onclick = function () {
    console.log("load");
		
    text.innerHTML = "Loaded."
    socket.emit("load", { studentname: "Tommy Pham", statename: "BreakoutState" });
	socket.on("load", function (saveData) {
		if (gameEngine.startGame) {
			console.log(saveData.data);
			loadState(saveData.data);
			//gameEngine.draw();

		} else {

				loadState(saveData.data);
				gameEngine.draw();
			
		}

	});
  
  }
};
