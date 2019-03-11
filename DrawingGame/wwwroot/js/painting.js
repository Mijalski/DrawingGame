
var canvasDiv = $("#drawing-canvas");
var context = document.getElementById('drawing-canvas').getContext("2d");

function setCanvasSize() {
    context.canvas.width = canvasDiv.parent().width();
    context.canvas.height = canvasDiv.parent().height();
}


var clickX = new Array();
var clickY = new Array();
var clickDrag = new Array();
var paint;

function paint(){
    context.clearRect(0, 0, context.canvas.width, context.canvas.height); // Clears the canvas
  
    context.strokeStyle = "#df4b26";
    context.lineJoin = "round";
    context.lineWidth = 5;
			
    for(var i=0; i < clickX.length; i++) {		
        context.beginPath();
        if(clickDrag[i] && i){
            context.moveTo(clickX[i-1], clickY[i-1]);
        }else{
            context.moveTo(clickX[i]-1, clickY[i]);
        }
        context.lineTo(clickX[i], clickY[i]);
        context.closePath();
        context.stroke();
    }
}