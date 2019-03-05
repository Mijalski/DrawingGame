
const urlParams = new URLSearchParams(window.location.search);
const keyCode = urlParams.get('keyCode').toUpperCase();
var userId = $.connection.hub.id;
var connection = new signalR.HubConnectionBuilder().withUrl("/RoomHub?"+keyCode).build();

//TODO remove it later on
connection.on("RecieveNewPlayerJoin", function (str) {
    console.log(str);
});

connection.start().then(function(){
    connection.invoke('AddToGroup', keyCode);
    
}).catch(function (err) {
    return console.error(err.toString());
});

connection.on("StartRound", function () {
    connection.invoke('RequestAnswer', userId);
});

connection.on("RecieveAnswer", function (str) {
    gameLogic.startDrawing(str);
});