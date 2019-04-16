

var answerHolder = $("#answer-button-holder");
var buttonAnswerSubmit = $("#confirm-answer");
var answerTextBox = $("#my-answer");

buttonAnswerSubmit.attr('disabled','disabled');

answerTextBox.on('input propertychange paste', function() {
    
    if ($(this).val() !== "") {
        buttonAnswerSubmit.removeAttr('disabled');

    } else {
        buttonAnswerSubmit.attr('disabled','disabled');
    }

});

var gameLogicClient = {

    currentAnswer: "",
    guessingOnMyDrawing: false,
    myGuess: "",


    startDrawing: function (answer) {
        $(".game").removeClass("d-none");
        $(".non-game").addClass("d-none");
        gameLogicClient.currentAnswer = answer;
        $("#answer-game").text("Hasło: " + gameLogicClient.currentAnswer.toUpperCase());
        clickX = [];
        clickY = [];
        clickDrag = [];
        colorToggle = [];
        colorPicker.css("background", darkColor);
        setCanvasSize();
    },

    createButtonForAnswer: function(element, index, array) {
        
        var newButton = $('<input/>').attr({ type: 'button', name:'btn'+index, value:element}).addClass("btn btn-primary btn-block btn-answer-vote");

        newButton.on("click", buttonVoteClick);
        answerHolder.append(newButton);
    }
};