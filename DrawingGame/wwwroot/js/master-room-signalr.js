
var keyCode = $("#room-id").html(); 
var connection = new signalR.HubConnectionBuilder().withUrl("/RoomHub?"+keyCode).build();
var startGameButton = $("#start-game");
var playerNamesList = $("#user-names");
var playerCounterBeforeGameStartsDiv = $("#player-count-pre-game");

connection.on("RecieveNewPlayerMaster", function (connectionId, userName) {

    console.log("new player attempt to join " + userName + " c " + connectionId);

    if (gameLogicMaster.playerArray.length < gameLogicMaster.maxPlayerCount) {
        

        if (gameLogicMaster.currentGameState === gameStateEnum.WAITING_FOR_PLAYERS) {

            var newPlayer = new Player(connectionId, userName);
            gameLogicMaster.playerArray.push(newPlayer);
            playerNamesList.append(`<div data-id='player${gameLogicMaster.playerArray.length-1}' class='player-name'>${userName}</div>`);
            playerCounterBeforeGameStartsDiv.text(gameLogicMaster.playerArray.length);

            if (gameLogicMaster.playerArray.length >= gameLogicMaster.minPlayerCount) {
                startGameButton.prop("disabled", false);
            }

            connection.invoke('ConfirmPlayerLogin', connectionId, newPlayer.drawLightColor, newPlayer.drawDarkColor);
            return;
        }
        else {
            
            let playerFound = gameLogicMaster.getPlayerForReconnect(userName, connectionId);
            
            if (playerFound != null) {
                connection.invoke('ConfirmPlayerLogin', connectionId, playerFound.drawLightColor, playerFound.drawDarkColor);
                return;
            } 
        }

    }
    else {

        //todo handle too much playerz trying to connect
    }
});

connection.on("PlayerDisconnected", function (connectionId) {
    gameLogicMaster.playerDisconnect(connectionId);
});

connection.on("RoomStarted", function (str) {
    playerFinishedCountDiv.text(gameLogicMaster.playerArray.length);
});

connection.start().then(function(){
    connection.invoke('CreateNewGroup', keyCode);
    
}).catch(function (err) {
    return console.error(err.toString());
});

startGameButton.off('click').on('click',
    function(e) {
        e.preventDefault();
        startRound();
});


connection.on("StartRound", function () {
    gameLogicMaster.startDrawing();
});


connection.on("ReadyDrawing", function(connectionId, userName) {
    var playerFound = gameLogicMaster.getPlayer(connectionId, userName);

    if (playerFound !== null) {
        gameLogicMaster.playerFinishedDrawing(playerFound);
    }
});

connection.on("RecieveDrawing", function(connectionId, currentAnswer, _clickX, _clickY, _clickDrag, _colorToggle, _canvasWidth, _canvasHeight) {

    gameLogicMaster.showNextDrawing(currentAnswer);

    let player = gameLogicMaster.playerArray[gameLogicMaster.currentlyShowingDrawingPlayer];

    lightColor = player.drawLightColor;
    darkColor = player.drawDarkColor;

    //assign values to paint
    clickX = _clickX;
    clickY = _clickY;
    clickDrag = _clickDrag;
    colorToggle = _colorToggle;
    clientCanvasWidth = _canvasWidth;
    clientCanvasHeight = _canvasHeight;
    paint();
});

function startRound() {
    
    connection.invoke('StartRound', keyCode);
}

function getDrawingOfUser(connectionId) {
    connection.invoke('GetDrawing', connectionId);
}

function startVoting() {

    connection.invoke('StartVoting', keyCode);
}

function guessCorrectAnswer(answers) {
    
    connection.invoke('GuessCorrectAnswer', keyCode, answers);
}

connection.on("GetAnswer", function(connectionId, userName, answer) {
    
    gameLogicMaster.setAnswer(connectionId, userName, answer);
});

connection.on("GetVote", function(connectionId, userName, buttonId) {
    
    gameLogicMaster.recieveVote(connectionId, userName, buttonId);
});

function finishVoting() {
    
    connection.invoke('FinishVoting', keyCode);
}

function finishAnswering() {
    
    connection.invoke('FinishAnswering', keyCode);
}