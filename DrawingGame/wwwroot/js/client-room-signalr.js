
const urlParams = new URLSearchParams(window.location.search);
const keyCode = urlParams.get('keyCode').toUpperCase();
var userId;
var userName = urlParams.get('userName');
var connection = new signalR.HubConnectionBuilder().withUrl("/RoomHub?"+keyCode).build();
var serverConnectionId;

//TODO remove it later on
connection.on("ConfirmPlayerJoin", function (gameState, serverId) {

    gameLogicClient.currentGameState = gameState;
    serverConnectionId = serverId;
    console.log(gameLogicClient.currentGameState);
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
    document.cookie = "answer=" + str;
});

$("#finish-drawing").click(function() {
    $(this).prev().remove(); //remove canvas
    $(this).prev().remove(); //remove answer text
    $(this).remove(); //remove button
    connection.invoke('ReadyDrawing', keyCode, userName);
});


connection.on("GetDrawing", function () {
    connection.invoke('SendDrawing', serverConnectionId, gameLogicClient.currentAnswer, clickX, clickY, clickDrag);
});
