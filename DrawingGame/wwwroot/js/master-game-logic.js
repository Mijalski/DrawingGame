﻿
var gameStateEnum = {
    WAITING_FOR_PLAYERS: 1,
    DRAWING: 2,
    ADDING_OWN_ANSWER: 3,
    GUESSING_CORRECT_ANSWER: 4,
    WAITING_FOR_NEW_ROUND: 5,
    DISPLAYING_HIGH_SCORE: 6
}

var timerDiv = $("#drawing-timer");
var preGameDiv = $("#pre-game");
var timerAndCountDiv = $("#timer-count");
var inGuessingDiv = $("#in-guessing");
var playerFinishedCountDiv = $("#player-count");
var maxPlayerCountDiv = $("#player-max-count");
var currentActionDiv = $("#current-action");
var answersDiv = $("#answers");
var timeLoop;
var standardAnswerTopOffset = 220; //in px
var standardAnswerRightOffset = 100;//in px

var pointsForCorrectAnswer = 5;
var pointsForGuessingCorrectly = 5;
var pointsForBaitingPlayer = 5;

var colors = [
        [ "#ff9d00", "#cc7d00"], //orange 0
        [ "#00ddff", "#00b9d6"], //light blue 1
        [ "#00ff90", "#00c46e"], //lime 2
        [ "#ff005d", "#cc004a"], //pink 3
        [ "#7a00ff", "#5900ba"], //violet 4
        [ "#0093fc", "#0078ce"], //dark blue 5
        [ "#a1ff00", "#75ba00"], //light green 6
        [ "#ff1d00", "#b21501"], //red 7
        [ "#372dff", "#1307fc"], //awful blue 8
        [ "#ff476f", "#961833"] //tuna 9
    ];

class Player {
    constructor(connectionId, userName) {
        this.connectionId = connectionId;
        this.userName = userName;
        this.isConnected = true;
        this.answer = "";
        this.answerVote = -1; // -1 means no vote, as 0 is a valid vote
        this.hasFinishedDrawing = false;
        this.alreadyShownDrawing = false;
        this.points = 0;
        this.drawLightColor = colors[gameLogicMaster.playerArray.length][0];
        this.drawDarkColor = colors[gameLogicMaster.playerArray.length][1];
        gameLogicMaster.playerConnectedCount++;
        return this;
    }
}

var gameLogicMaster = {
    currentGameState: gameStateEnum.WAITING_FOR_PLAYERS,
    drawingTime: 45,
    guessingTime: 30,
    answeringTime: 20,
    showingAnswersTime: 4, //IT HAS TO BE MULTIPLIED BY PLAYER COUNT!
    minPlayerCount: 2,
    maxPlayerCount: 10,
    answerPosition: 0, //this is set so that we know where the correct answer is in the random set
    playerConnectedCount: 0, //count of active players
    currentActionTime: 0,
    finishedActionPlayerCount: 0,
    playerArray: [],
    currentlyShowingDrawingPlayer: -1,
    answerArrForDisplay: [],

    getPlayer: function (connectionId, userName) {

        for (let i = 0; i < this.playerArray.length; i++) {

            if (this.playerArray[i].userName === userName &&
                this.playerArray[i].connectionId === connectionId) {
                return this.playerArray[i];
            }
        }

        return null;

    },

    playerDisconnect: function(connectionId) {

        let player = this.getPlayerForDisconnect(connectionId);
        if (player != null) {
            player.isConnected = false;
            this.playerConnectedCount--;
            this.decrementUserCount();
        }
    },
    
    getPlayerForDisconnect: function(connectionId) {

        for (let i = 0; i < this.playerArray.length; i++) {

            if (this.playerArray[i].connectionId === connectionId) {

                console.log("DISCONNECTED USER");
                return this.playerArray[i];
            }
        }

        return null;
    },

    getPlayerForReconnect: function(userName, connectionId) {

        for (let i = 0; i < this.playerArray.length; i++) {

            let player = this.playerArray[i];

            if (player.userName === userName && !player.isConnected) {
                
                console.log(`RECONNECTED USER${userName}`);
                this.playerConnectedCount++;
                player.isConnected = true;
                player.connectionId = connectionId;
                return this.playerArray[i];
            }
        }

        return null;
    },

    backToLobby: function() {
        
        this.currentGameState = gameStateEnum.WAITING_FOR_PLAYERS;
        preGameDiv.removeClass("d-none");
        inGuessingDiv.addClass("d-none");
        timerAndCountDiv.addClass("d-none");

        $(".player-name").each(function() {
            var playerId = parseInt($(this).attr('data-id').replace('player',''), 10);
            let player = gameLogicMaster.playerArray[playerId];
            $(this).html(`<div data-id='player${playerId}' class='player-name'>${player.userName}  punkty: ${player.points}</div>`); 
        });
    },

    startDrawing: function () {

        this.currentGameState = gameStateEnum.DRAWING;
        this.currentlyShowingDrawingPlayer = -1;

        inGuessingDiv.addClass("d-none");
        preGameDiv.addClass("d-none");
        timerAndCountDiv.removeClass("d-none");
        currentActionDiv.text("Pora rysować"); //time to draw

        this.setTimerOn(this.drawingTime);
    },

    decrementUserCount: function() {
        
        maxPlayerCountDiv.text(this.playerConnectedCount);
        if (this.finishedActionPlayerCount === this.playerConnectedCount) {

            if (gameLogicMaster.currentGameState === gameStateEnum.DRAWING) {

                gameLogicMaster.getNextDrawing();
            } 

        } else if (this.finishedActionPlayerCount === this.playerConnectedCount - 1) {

            if (gameLogicMaster.currentGameState === gameStateEnum.ADDING_OWN_ANSWER) {

                gameLogicMaster.showAnswers();
            } 
            else if (gameLogicMaster.currentGameState === gameStateEnum.GUESSING_CORRECT_ANSWER) {

                gameLogicMaster.showVotes();
            } 
        }
    },

    changeTimer: function () {

        if (gameLogicMaster.currentActionTime === 0) {

            clearInterval(timeLoop);

            //todo send out to everyone to stop drawing or get answer for them in db - depends on game state
            if (gameLogicMaster.currentGameState === gameStateEnum.DRAWING) {

                gameLogicMaster.getNextDrawing();
            } 
            else if (gameLogicMaster.currentGameState === gameStateEnum.ADDING_OWN_ANSWER) {

                gameLogicMaster.showAnswers();
            } 
            else if (gameLogicMaster.currentGameState === gameStateEnum.GUESSING_CORRECT_ANSWER) {

                gameLogicMaster.showVotes();
            } 
            else if (gameLogicMaster.currentGameState === gameStateEnum.DISPLAYING_HIGH_SCORE) {
                
                gameLogicMaster.getNextDrawing();
            }

        }
        timerDiv.text(gameLogicMaster.currentActionTime--);
    },

    setTimerOn: function (time) {

        this.finishedActionPlayerCount = 0;
        this.setTimerOff();

        if (this.currentGameState === gameStateEnum.DISPLAYING_HIGH_SCORE) {
            
            this.finishedActionPlayerCount = this.playerConnectedCount-1;
        }

        maxPlayerCountDiv.text(this.playerConnectedCount);
        playerFinishedCountDiv.text(this.finishedActionPlayerCount);
        console.log(this.finishedActionPlayerCount);
        this.currentActionTime = time;

        if (this.currentGameState === gameStateEnum.DRAWING) {
            maxPlayerCountDiv.text(this.playerConnectedCount);
        } else {
            maxPlayerCountDiv.text(this.playerConnectedCount - 1); //the person that was drawing wont be answering or guessing
        }

        timeLoop = setInterval(gameLogicMaster.changeTimer, 1000);
    },

    setTimerOff: function () {

        clearInterval(timeLoop);
    },

    playerFinishedDrawing: function (player) {

        player.hasFinishedDrawing = true;
        this.finishedActionPlayerCount++;
        playerFinishedCountDiv.text(this.finishedActionPlayerCount);

        if (this.finishedActionPlayerCount === this.playerConnectedCount) {
            
            this.getNextDrawing();
        }
    },

    getNextDrawing: function () {

        answersDiv.empty();

        let foundPlayer = false;
        while (!foundPlayer) {
            this.currentlyShowingDrawingPlayer++;

            if (this.currentlyShowingDrawingPlayer >= this.playerArray.length) {

                this.backToLobby(); // Start again no more players
                return;
            }
            else if (this.playerArray[this.currentlyShowingDrawingPlayer].isConnected === true) {
                foundPlayer = true;
            }
        }
        
        this.setTimerOff();
        this.currentGameState = gameStateEnum.ADDING_OWN_ANSWER;
        let player = this.playerArray[this.currentlyShowingDrawingPlayer];
        player.alreadyShownDrawing = true;
        getDrawingOfUser(player.connectionId);
    },

    showNextDrawing: function (answer) {

        inGuessingDiv.removeClass("d-none");
        currentActionDiv.text("Pora zgadywać"); //time to guess what the drawing is about

        for (let i = 0; i < this.playerArray.length; i++) { //clear out answers for players

            let player = this.playerArray[i];
            player.answer = "";
            player.answerVote = -1;
        }

        this.playerArray[this.currentlyShowingDrawingPlayer].answer = answer.toUpperCase();
        
        startVoting();
        this.setTimerOn(this.guessingTime);
    },

    setAnswer: function (connectionId, userName, answer) {

        let player = this.getPlayer(connectionId, userName);
        player.answer = answer.toUpperCase();
        this.finishedActionPlayerCount++;
        playerFinishedCountDiv.text(this.finishedActionPlayerCount);

        if (this.finishedActionPlayerCount === this.playerConnectedCount - 1) {
            this.setTimerOff();
            this.showAnswers();
        }
    },

    showAnswers: function () {

        finishAnswering();
        let answerArrForDisplay = [];
        let answerArrForSending = [];

        for (let i = 0; i < this.playerArray.length; i++) {

            if (i !== this.currentlyShowingDrawingPlayer &&
                      this.playerArray[i].answer !== "") {

                let player = this.playerArray[i];
                answerArrForDisplay.push(`<div id='btn${i}' data-id='${i}' class='floating-btn'>${player.answer}</div>`);
                answerArrForSending.push(player.answer);
            }
        }

        //insert the answer in random place
        let randomVal = Math.floor(Math.random() * this.playerArray.length);
        let user = this.playerArray[this.currentlyShowingDrawingPlayer];

        answerArrForDisplay.splice(randomVal, 0, `<div id='btn${this.currentlyShowingDrawingPlayer}' data-id='${this.currentlyShowingDrawingPlayer}' class='floating-btn'>${user.answer}</div>`);
        answerArrForSending.splice(randomVal, 0, user.answer);

        answersDiv.html(answerArrForDisplay.join(""));

        this.setTimerOn(this.answeringTime);

        //apply styling
        $(".floating-btn").each(function( index ) {
            
            let topOffset = standardAnswerTopOffset + (index * 100);
            $(this).css('top', `${topOffset}px`);

            if (index % 2 === 0) {

                $(this).css('right', `${standardAnswerRightOffset}px`);
            }
        });

        this.currentGameState = gameStateEnum.GUESSING_CORRECT_ANSWER;

        guessCorrectAnswer(answerArrForSending);
    },

    getAnswerVoteIdForButton: function(buttonId) {
        buttonId += 1;
        return parseInt($(`#answers > div:nth-child(${buttonId})`).attr('id').replace('btn',''), 10); //convert chosen button id to just int value
    },

    recieveVote: function (connectionId, userName, buttonId) {

        let player = this.getPlayer(connectionId, userName);
        let answerVoteId = this.getAnswerVoteIdForButton(buttonId);
        player.answerVote = answerVoteId;

        this.finishedActionPlayerCount++;
        playerFinishedCountDiv.text(this.finishedActionPlayerCount);

        if (this.finishedActionPlayerCount === this.playerConnectedCount - 1) {
            console.log("ROUND FINISHED");
            this.showVotes();
        }
    },

    showVotes: function() {

        finishVoting();
        currentActionDiv.text("Odpowiedzi: ");
        this.currentGameState = gameStateEnum.DISPLAYING_HIGH_SCORE;
        
        $(".floating-btn").each(function(index) {
            
            setTimeout(function () {
                gameLogicMaster.showIndividualVote(index);
            }, 4000*index);
        });

        this.setTimerOn(this.showingAnswersTime*this.playerArray.length);
    },

    showIndividualVote: function(index) {

        let button = $(`#btn${index}`);

        button.animate({
            left: button.parent().width() / 2 - button.width() / 2
        }, 1000);

        let playerId = button.data("id");
        let playersWhoPickedThisAnswer = [];
        let isCorrectAnswer = index === this.currentlyShowingDrawingPlayer;

        for (let i = 0; i < this.playerArray.length; i++) {
            
            let player = this.playerArray[i];
            
            if (i !== this.currentlyShowingDrawingPlayer && player.answerVote === index) {

                playersWhoPickedThisAnswer.push(player);
            }
        }

        if (!isCorrectAnswer) {

            let answerOwnerUserName = this.playerArray[playerId];

            button.addClass("incorrect-answer");

            if (playersWhoPickedThisAnswer.length > 0) {

                let appendHeader = true;
                playersWhoPickedThisAnswer.forEach(function(element) {

                    if (answerOwnerUserName !== element) {  //don't want to award points to player who voted his own answer :D

                        if (appendHeader) {
                            
                            button.prepend(`Nabrał was: ${answerOwnerUserName.userName}<br/>`);
                            button.append(`<br/>Frajerzy:`);
                            appendHeader = !appendHeader;
                        }

                        answerOwnerUserName.points += pointsForBaitingPlayer;
                        button.append(`<br/>${element.userName}`);
                    }
                });
            } 
            else {

                button.prepend(`Nikogo nie nabrał: ${answerOwnerUserName.userName}<br/>`);
            }
        } 
        else {

            button.addClass("correct-answer");
            button.prepend(`Odpowiedź prawidłowa!<br/>`);

            let drawingPlayer = this.playerArray[this.currentlyShowingDrawingPlayer];

            if (playersWhoPickedThisAnswer.length > 0) {

                button.append(`<br/>Odgadli:`);

                playersWhoPickedThisAnswer.forEach(function(element) {

                    if (playersWhoPickedThisAnswer.length === gameLogicMaster.playerConnectedCount.length - 1) { //don't award players if everyone guessed correcty

                        drawingPlayer.points += pointsForCorrectAnswer;
                    }
                    element.points += pointsForGuessingCorrectly;
                    button.append(`<br/>${element.userName}`);
                });
            }
        }
        
        setTimeout(function () {
            gameLogicMaster.hideIndividualVote(button, index % 2 === 0);
        }, 3000);
    },

    hideIndividualVote: function(button, moveToRight) {
        
        if (moveToRight) {

            button.animate({
                    left: button.parent().width() - button.width()
                }, 1000);

        } else {

            button.animate({
                left: standardAnswerRightOffset
            }, 1000);

        }
    }
};