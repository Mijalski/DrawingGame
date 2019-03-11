
var keyCode = $("#room-id").html(); 
var connection = new signalR.HubConnectionBuilder().withUrl("/RoomHub?"+keyCode).build();
var playerCounterDiv = $("#player-count");
var startGameButton = $("#start-game");
var playerNamesList = $("#user-names");

connection.on("RecieveNewPlayerMaster", function (connectionId, userName) {

    console.log("new player attempt to join " + userName);

    if (gameLogicMaster.currentPlayerCount < gameLogicMaster.maxPlayerCount) {
        

        if (gameLogicMaster.currentGameState === gameStateEnum.WAITING_FOR_PLAYERS) {

            gameLogicMaster.currentPlayerCount++;
            playerCounterDiv.text(gameLogicMaster.currentPlayerCount);
            gameLogicMaster.playerArray.push(new Player(connectionId, userName));
            playerNamesList.append(` ${userName}`);

            if (gameLogicMaster.currentPlayerCount >= gameLogicMaster.minPlayerCount) {
                startGameButton.prop("disabled", false);
            }

            connection.invoke('ConfirmPlayerLogin', connectionId, gameLogicMaster.currentGameState);
            return;
        }
        else if (gameLogicMaster.currentPlayerCount < gameLogicMaster.playerArray.length) {

            if (gameLogicMaster.currentPlayerCount + 1 === gameLogicMaster.playerArray.length) {

                //we're missing one player, might as well assume it's him
                connection.invoke('ConfirmPlayerLogin', connectionId, gameLogicMaster.currentGameState);
                return;
            }

            var playerFound = gameLogicMaster.getPlayer(connectionId, userName);
            
            if (playerFound == null) {

                gameLogicMaster.currentPlayerCount++;
                connection.invoke('ConfirmPlayerLogin', connectionId, gameLogicMaster.currentGameState);
                return;
            } 
        }
        else {
            //todo player connecting to existing game that is packed
        }

    }
    else {

        //todo handle too much playerz trying to connect
    }
});

connection.on("RoomStarted", function (str) {
    document.cookie = "keyCode=" + str;
    playerCounterDiv.text(gameLogicMaster.currentPlayerCount);
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
    gameLogicMaster.startDrawing();
});


connection.on("ReadyDrawing", function(connectionId, userName) {
    var playerFound = gameLogicMaster.getPlayer(connectionId, userName);

    if (playerFound == null) {
        gameLogicMaster.playerFinishedDrawing(playerFound);
    }
});

connection.on("RecieveDrawing", function(_currentAnswer, _clickX, _clickY, _clickDrag) {

    gameLogicMaster.showNextDrawing();

    clickX = _clickX;
    clickY = _clickY;
    clickDrag = _clickDrag;
    paint();
});

function getDrawingOfUser(connectionId) {
    connection.invoke('GetDrawing', connectionId);
}