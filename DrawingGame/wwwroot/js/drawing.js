
var canvasDiv = $("#drawing-canvas");
var canvasDivJs = document.getElementById("drawing-canvas");
var context = canvasDivJs.getContext("2d");

var lightColor;
var darkColor;
var usingLightColor = true;

function setCanvasSize() {
    canvasWidth = context.canvas.width = canvasDiv.parent().width();
    canvasHeight = context.canvas.height = $(window).height() - 100;
}

//MOBILE DRAWING
canvasDivJs.addEventListener( 'touchstart', touchDown,  {passive: false});
canvasDivJs.addEventListener( 'touchmove', touchMove,  {passive: false});
canvasDivJs.addEventListener( 'touchend', touchCancel,  {passive: false});
canvasDivJs.addEventListener( 'touchcancel', touchCancel,  {passive: false});

//DESKTOP DRAWING
canvasDivJs.addEventListener( 'mousedown', touchDown, false);
canvasDivJs.addEventListener( 'mousemove', touchMove, false);
canvasDivJs.addEventListener( 'mouseup', touchCancel, false);
canvasDivJs.addEventListener( 'mouseleave', touchCancel, false);

function touchDown(e) {
    e.preventDefault();
    var mouseX = (e.pageX || e.changedTouches[0].pageX) - this.offsetLeft;
    var mouseY = (e.pageY || e.changedTouches[0].pageY)  - this.offsetTop;
    
    paint = true;
    addClick(mouseX, mouseY, false);
    redraw();
}

function touchMove(e) {
    e.preventDefault();
    if(paint){
        addClick((e.pageX || e.changedTouches[0].pageX) - this.offsetLeft,
                 (e.pageY || e.changedTouches[0].pageY) - this.offsetTop, true);
        redraw();
    }
}

function touchCancel(e) {
    e.preventDefault();
    paint = false;
}

var clickX = new Array();
var clickY = new Array();
var clickDrag = new Array();
var colorToggle = new Array();
var canvasWidth = 0;
var canvasHeight = 0;
var paint;
var colorPicker = $("#color-picker");

colorPicker.on( "click", function() {
    usingLightColor = !usingLightColor;
    console.log("switcharoo");
    colorPicker.css("background", usingLightColor ? darkColor : lightColor); //we want it reversed to show the other color
});

function addClick(x, y, dragging)
{
    clickX.push(x);
    clickY.push(y);
    clickDrag.push(dragging);
    colorToggle.push(usingLightColor);
}

function redraw(){
    context.clearRect(0, 0, context.canvas.width, context.canvas.height); // Clears the canvas
  
    context.lineJoin = "round";
    context.lineWidth = 5;
			
    for(var i=0; i < clickX.length; i++) {		

        context.strokeStyle = colorToggle[i] ? lightColor : darkColor;
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