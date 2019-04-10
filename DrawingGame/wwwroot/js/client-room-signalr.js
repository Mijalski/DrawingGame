
const urlParams = new URLSearchParams(window.location.search);
const keyCode = urlParams.get('keyCode').toUpperCase();
var userId;
var userName = urlParams.get('userName');//configureLogging(signalR.LogLevel.Trace)
var connection = new signalR.HubConnectionBuilder().withUrl("/RoomHub?"+keyCode).build();
var serverConnectionToReturnAnswer;

connection.on("ConfirmPlayerJoin", function (lightC, darkC) {

    console.log(lightC + ' ' + darkC);
    lightColor = lightC;
    darkColor = darkC;
});

connection.start().then(function(){
    connection.invoke('AddToGroup', keyCode, userName);
    
}).catch(function (err) {
    return console.error(err.toString());
});

connection.on("StartRound", function () {
    connection.invoke('RequestAnswer');
});

connection.on("RecieveAnswer", function (str) {
    gameLogicClient.startDrawing(str);
});

connection.on("GetDrawing", function (serverConnectionId) {
    connection.invoke('SendDrawing', serverConnectionId, gameLogicClient.currentAnswer, clickX, clickY, clickDrag, colorToggle, canvasWidth, canvasHeight);
    gameLogicClient.guessingOnMyDrawing = true;
});

connection.on("StartVoting", function (connectionId) {
    
    if (!gameLogicClient.guessingOnMyDrawing) { //we don't want uset to guess his own drawing :)

        serverConnectionToReturnAnswer = connectionId;
        $("#guessing-answer").removeClass("d-none");

    } else {

        $(".non-game").removeClass("d-none");
    }
});

connection.on("GuessCorrectAnswer", function (answers) {
    
    if (!gameLogicClient.guessingOnMyDrawing) { //for now no voting for drawing person - maybe in the future vote the funniest one

        answers.forEach(gameLogicClient.createButtonForAnswer);
    }
    $("#answer-button-holder").removeClass("d-none");
});

connection.on("VotingFinished", function () {
    $("#answer-button-holder").empty();
    $("#my-answer").val('');
    gameLogicClient.guessingOnMyDrawing = false;

    $(".non-game").addClass("d-none");
    
});

connection.on("AnsweringFinished", function () {
    $("#guessing-answer").addClass("d-none");
    
});

$("#confirm-answer").click(function() {
    gameLogicClient.myGuess = $("#my-answer").val();
    $("#guessing-answer").addClass("d-none");
    connection.invoke('SubmitAnswer', serverConnectionToReturnAnswer, userName, gameLogicClient.myGuess);
});

$("#finish-drawing").click(function() {
    $(".game").addClass("d-none");
    connection.invoke('ReadyDrawing', keyCode, userName);
});

function buttonVoteClick() {
    console.log( $(this).attr('name').replace('btn',''));
    $("#answer-button-holder").addClass("d-none");
    connection.invoke('VoteAnswer', serverConnectionToReturnAnswer, userName,$(this).attr('name').replace('btn',''));
}
