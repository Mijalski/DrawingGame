
var gameStateEnum = {
    WAITING_FOR_PLAYERS: 1,
    DRAWING: 2,
    ADDING_OWN_ANSWER: 3,
    GUESSING_CORRECT_ANSWER: 4,
    WAITING_FOR_NEW_ROUND: 5,
    DISPLAYING_HIGH_SCORE: 6
}

var gameLogicClient = {
    
    currentGameState: gameStateEnum.WAITING_FOR_PLAYERS,
    currentAnswer: "",

    startDrawing: function (answer) {
        $(".game").toggleClass("d-none");
        $(".non-game").toggleClass("d-none");
        gameLogicClient.currentAnswer = answer;
        $("#answer-game").text("Hasło: " + gameLogicClient.currentAnswer);
        setCanvasSize();
    },
};