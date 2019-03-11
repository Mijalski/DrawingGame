
var gameStateEnum = {
    WAITING_FOR_PLAYERS: 1,
    DRAWING: 2,
    ADDING_OWN_ANSWER: 3,
    GUESSING_CORRECT_ANSWER: 4,
    WAITING_FOR_NEW_ROUND: 5,
    DISPLAYING_HIGH_SCORE: 6
}

var timer = $("#drawing-timer");
var playerDrawingFinishedCount = $("#player-drawing-count");
var timeLoop;

class Player {
    constructor(connectionId, userName) {
        this.connectionId = connectionId;
        this.userName = userName;
        this.isConnected = true;
        this.hasAnswered = false;
        this.hasFinishedDrawing = false;
        this.alreadyShownDrawing = false;
        this.points = 0;
    }
}

var gameLogicMaster = {

    currentGameState: gameStateEnum.WAITING_FOR_PLAYERS,
    drawingTime: 45,
    minPlayerCount: 2,
    maxPlayerCount: 10,
    currentPlayerCount: 0, // players that are now in game - this variable may vary from playerArray.length - as users may drop their connection
    currentDrawingTime: 0,
    currentlyDrawingPlayerCount: 0,
    playerArray: [],
    currentlyShowingDrawingPlayer: 0,
    
    getPlayer: function(connectionId, userName) {

        for (let i = 0; i < gameLogicMaster.playerArray.length; i++) {

            if (gameLogicMaster.playerArray[i].userName === userName &&
                gameLogicMaster.playerArray[i].connectionId === connectionId ) {
                return gameLogicMaster.playerArray[i];
            }
        }

        return null;

    },

    startDrawing: function() {

        gameLogicMaster.currentGameState = gameStateEnum.DRAWING;

        $("#pre-game").toggleClass("d-none");
        $("#in-drawing").toggleClass("d-none");
        $("#player-drawing-max-count").text(gameLogicMaster.currentPlayerCount);
        gameLogicMaster.currentDrawingTime = gameLogicMaster.drawingTime;
        timeLoop = setInterval(gameLogicMaster.changeTimer, 1000);
    },

    changeTimer: function() {
        if (gameLogicMaster.currentDrawingTime === 0) {

            clearInterval(timeLoop);
            gameLogicMaster.currentlyShowingDrawingPlayer = 0;
            gameLogicMaster.getNextDrawing();
        }
        timer.text(gameLogicMaster.currentDrawingTime--);
    },

    playerFinishedDrawing: function(player) {
        
        player.hasFinishedDrawing = true;
        gameLogicMaster.currentlyDrawingPlayerCount++;
        playerDrawingFinishedCount.text(gameLogicMaster.currentlyDrawingPlayerCount);

        if (gameLogicMaster.currentlyDrawingPlayerCount === gameLogicMaster.currentPlayerCount) {
            
            gameLogicMaster.currentlyShowingDrawingPlayer = 0;
            gameLogicMaster.getNextDrawing();
        }
    },
    
    getNextDrawing: function() {
        getDrawingOfUser(gameLogicMaster.playerArray[gameLogicMaster.currentlyShowingDrawingPlayer]);
    },

    showNextDrawing: function() {
        $(".game").toggleClass("d-none");
        $(".non-game").toggleClass("d-none");
    }
};