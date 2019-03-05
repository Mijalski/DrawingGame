
var keyCode = $("#room-id").html(); 
var connection = new signalR.HubConnectionBuilder().withUrl("/RoomHub?"+keyCode).build();
var playerCount = 0;
var minPlayerCount = 3;
var playerCounterDiv = $("#player-count");
var startGameButton = $("#start-game");

connection.on("RecieveNewPlayerJoin", function (str) {
    playerCount++;
    playerCounterDiv.text(playerCount);

    if (playerCount > minPlayerCount) {
        startGameButton.prop("disabled", false);
    }
});

connection.on("RoomStarted", function (str) {
    playerCount=0;
    playerCounterDiv.text(playerCount);
});

connection.start().then(function(){
    connection.invoke('CreateNewGroup', keyCode);
    
}).catch(function (err) {
    return console.error(err.toString());
});

startGameButton.off('click').on('click',
    function(e) {
        e.preventDefault();
        connection.invoke('StartRound', keyCode);
});

connection.on("StartRound", function () {
    gameLogic.startDrawingMaster();
});