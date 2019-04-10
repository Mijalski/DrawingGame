
var canvasDiv = $("#drawing-canvas");
var context = document.getElementById("drawing-canvas").getContext("2d");
var canvasHolder = $(".canvas-holder-master");

var lightColor;
var darkColor;

function setCanvasSize() {
    canvasHeight = context.canvas.height = $(".body-content").height() - $("#timer-count").height();
    canvasWidth = context.canvas.width = canvasHeight / screenRatio;
    console.log('h  ' + canvasHeight + ' w   ' + canvasWidth + ' cr  ' +screenRatio );
    let marginLeft  = (canvasHolder.width() - canvasWidth) / 2;
    canvasDiv.css('margin-left', marginLeft + 'px');
}


var clickX = new Array();
var clickY = new Array();
var clickDrag = new Array();
var colorToggle = new Array();
var canvasWidth = 0;
var canvasHeight = 0;
var clientCanvasWidth = 0;
var clientCanvasHeight = 0;
var canvasWidthRatio = 0.0;
var canvasHeightRatio = 0.0;
var screenRatio = 0.0;
var paint;
var waitTime = 15; //in ms

function paint() {

    screenRatio = clientCanvasHeight / clientCanvasWidth;
    
    setCanvasSize();

    canvasWidthRatio = canvasWidth / clientCanvasWidth;
    canvasHeightRatio = canvasHeight / clientCanvasHeight;

    context.clearRect(0, 0, context.canvas.width, context.canvas.height); // Clears the canvas
  
    context.lineJoin = "round";
    context.lineWidth = 5;
			
    paintCurrent(0);
}

function paintCurrent(i) {
    context.strokeStyle = colorToggle[i] ? lightColor : darkColor;		
    context.beginPath();

    if(clickDrag[i] && i){
        context.moveTo(clickX[i-1]*canvasWidthRatio, clickY[i-1]*canvasHeightRatio);
    }else{
        context.moveTo(clickX[i]*canvasWidthRatio, clickY[i]*canvasHeightRatio);
    }

    context.lineTo(clickX[i]*canvasWidthRatio, clickY[i]*canvasHeightRatio);
    context.closePath();
    context.stroke();

    if (i < clickX.length) {
        
        setTimeout(function () {
            paintCurrent(++i);
        }, waitTime);
    } 
}